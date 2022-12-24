const Product = require("../models/Product");
const User = require("../models/User");
const Story = require("../models/Story");

exports.getIndex = async (req, res, next) => {
  const topProducts = await Product.find({ top: true });
  const allProducts = await Product.find({ top: false });
  const stories = await Story.find();

  return res.status(200).json({
    topProducts,
    allProducts,
    stories: {
      title: "Top Stories",
      news: stories,
    },
  });
};

exports.getCart = async (req, res, next) => {
  const user = req.user;
  const userInfo = await User.findOne({ username: user })
    .populate("basket.cartItems.productId")
    .exec();

  if (!userInfo) {
    return res.status(401).json({ message: "user not found" });
  }

  const cartData = userInfo.basket;

  return res.status(200).json({ data: cartData });
};

exports.addToCart = async (req, res, next) => {
  const user = req.user;
  const { productId } = req.params;

  const productInfo = Product.findOne({ _id: productId }).exec();

  if (!productInfo) {
    return res.status(404).json({ message: "no product found with this id" });
  }
  const userInfo = await User.findOne({ username: user });

  if (!userInfo) {
    return res.status(401).json({ message: "user not found" });
  }

  await userInfo.addToCart(productId);
  res.sendStatus(200);
};

exports.removeFromCart = async (req, res, next) => {
  const user = req.user;
  const { productId } = req.params;
  const userInfo = await User.findOne({ username: user });

  if (!userInfo) {
    return res.status(401).json({ message: "user not found" });
  }

  await userInfo.removeFromCart(productId);

  return res.status(200).json({ message: "item removed successfully" });
};

exports.clearCart = async (req, res, next) => {
  const user = req.user;
  const userInfo = await User.findOne({ username: user });

  if (!userInfo) {
    return res.status(401).json({ message: "user not found" });
  }

  userInfo.basket = {
    totalAmount: 0,
    totalQTY: 0,
    cartItems: [],
  };

  userInfo.save();

  return res.status(200).json({ message: "cart items cleared successfully" });
};
