const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      // required: true,
      unique: true,
    },
    price: {
      type: Number,
      // required: true,
      unique: true,
    },

    image: {
      type: String,
      // required: false,
    },
    public_id: {
      type: String,
    },
    size: {
      type: [String],
    },
    color: {
      type: [String],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { versionKey: false },
);
const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
