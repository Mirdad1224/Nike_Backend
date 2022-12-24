const mongoose = require("mongoose");
const Product = require("./Product");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  favorates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  basket: {
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalQTY: {
      type: Number,
      default: 0,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        cartQuantity: {
          type: Number,
        },
      },
    ],
  },
  refreshToken: String,
});

userSchema.methods.addToCart = async function (productId) {
  const product = await Product.findOne({ _id: productId }).exec();

  const cartProductIndex = this.basket.cartItems.findIndex((cp) => {
    return cp.productId.toString() === productId.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.basket.cartItems];

  if (cartProductIndex >= 0) {
    newQuantity = this.basket.cartItems[cartProductIndex].cartQuantity + 1;
    updatedCartItems[cartProductIndex].cartQuantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId,
      cartQuantity: newQuantity,
    });
  }
  const updatedAmount = this.basket.totalAmount + +product.price;
  const updatedQTY = this.basket.totalQTY + 1;
  const updatedCart = {
    totalAmount: updatedAmount,
    totalQTY: updatedQTY,
    cartItems: updatedCartItems,
  };
  this.basket = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = async function (productId) {
  const product = await Product.findOne({ _id: productId }).exec();

  const updatedCartItems = this.basket.cartItems.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  const cartProductIndex = this.basket.cartItems.findIndex((cp) => {
    return cp.productId.toString() === productId.toString();
  });

  const deletedQuantity = this.basket.cartItems[cartProductIndex].cartQuantity;

  const updatedAmount =
    this.basket.totalAmount - deletedQuantity * +product.price;
  const updatedQTY = this.basket.totalQTY - deletedQuantity;
  const updatedCart = {
    totalAmount: updatedAmount,
    totalQTY: updatedQTY,
    cartItems: updatedCartItems,
  };
  this.basket = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.basket = { items: [], totalAmount: 0, totalQTY: 0 };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
