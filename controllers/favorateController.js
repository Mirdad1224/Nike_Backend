const User = require("../models/User");

exports.getFavorates = async (req, res, next) => {
  const user = req.user;
  const userInfo = await User.findOne({ username: user })
    .populate({
      path: "favorates",
    })
    .exec();

  if (!userInfo) {
    return res.status(401).json({ message: "user not found" });
  }

  const favorateList = userInfo.favorates;

  return res.status(200).json({ data: favorateList });
};

exports.postFavorate = async (req, res, next) => {
  const user = req.user;
  const { productId } = req.params;
  const userInfo = await User.findOne({ username: user });

  if (!userInfo) {
    return res.status(401).json({ message: "user not found" });
  }
  const favorateIndex = userInfo.favorates.findIndex((f) => {
    return f.toString() === productId.toString();
  });

  let updatedFavorates;

  if (favorateIndex >= 0) {
    updatedFavorates = userInfo.favorates.filter((f) => {
      return f.toString() !== productId.toString();
    });
    userInfo.favorates = updatedFavorates;
  } else {
    updatedFavorates = [...userInfo.favorates, productId];
    userInfo.favorates = updatedFavorates;
  }

  await userInfo.save();

  return res.status(200).json({ message: "operation done successfully" });
};
