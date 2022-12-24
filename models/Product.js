const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  btn: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  shadow: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  top: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
