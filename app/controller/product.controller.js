const httpStatusCode = require("../utils/httpStatusCode");
const cloudinary = require("../config/cloudinary");
const ProductDetails = require("../model/productModel");
class ProductController {
  // Create Data

  async createProduct(req, res) {
    try {
      const { name, desc, price, size, color } = req.body;
      if (!name || !desc || !price || !size || !color) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }
      const Product = new ProductDetails({
        name,
        desc,
        price,
        size,
        color,
      });
      if (req.file) {
        Product.image = req.file.path;
        Product.public_id = req.file.filename;
      }
      const result = await Product.save();
      if (result) {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "Product Added successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get All Data

  async getProduct(req, res) {
    try {
      const showdata = await ProductDetails.find({ isDelete: false });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Product get successfully",
        data: showdata,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get Single Data

  async getSingleProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await ProductDetails.findById(id);
      if (!product) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "id not found",
        });
      }
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Product get successfully",
        data: product,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update data

  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await ProductDetails.findById(id);
      if (!product) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "id not found",
        });
      }
      let updateObj = { ...req.body };
      if (req.file) {
        if (product.public_id) {
          await cloudinary.uploader.destroy(product.public_id);
        }
        updateObj.image = req.file.path;
        updateObj.public_id = req.file.filename;
      }
      const updateData = await ProductDetails.findByIdAndUpdate(id, updateObj, {
        new: true,
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "data Updated successfully",
        data: updateData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Soft Delete

  async softDeleteProduct(req, res) {
    try {
      const id = req.params.id;
      const softDeleleId = await ProductDetails.findByIdAndUpdate(
        id,
        { isDelete: true },
        { new: true },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "data deleted successfully",
        data: softDeleleId,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Restore Data

  async restoreProduct(req, res) {
    try {
      const id = req.params.id;
      const restoreData = await ProductDetails.findByIdAndUpdate(
        id,
        { isDelete: false },
        { new: true },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "data restored successfully",
        data: restoreData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete Data

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      const deleteData = await ProductDetails.findById(id);
      if (!deleteData) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "id not found",
        });
      }
      console.log(deleteData.image);
      if (deleteData.public_id) {
        await cloudinary.uploader.destroy(deleteData.public_id);
      }
      await ProductDetails.findByIdAndDelete(id);
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "data Deleted successfully",
        data: deleteData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
