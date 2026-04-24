const UserModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
class AuthController {
  // Register

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid email format",
        });
      }

      if (password.length < 6) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      const existUser = await UserModel.findOne({ email });
      if (existUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "user already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassowrd = await bcrypt.hash(password, salt);
      const userData = new UserModel({
        name,
        email,
        password: hashPassowrd,
      });
      if (req.file) {
        userData.profileImage = req.file.path;
        userData.public_id = req.file.filename;
      }
      const result = await userData.save();
      if (result) {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "User Added successfully",
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

  // Login

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const checkUser = await UserModel.findOne({ email });
      if (!checkUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "invalid Email",
        });
      }
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (!checkPassword) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "wrong password",
        });
      }
      const token = jwt.sign(
        {
          id: checkUser._id,
          name: checkUser.name,
          email: checkUser.email,
          profileImage: checkUser.profileImage,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User Logedin Successfully",
        data: {
          id: checkUser._id,
          name: checkUser.name,
          email: checkUser.email,
        },
        token: token,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //Get Profile

  async profile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserModel.findById(userId).select("-password");
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: " successfull",
        data: user,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, email, password } = req.body;
      let updateObj = {};
      if (name) {
        updateObj.name = name;
      }
      if (email) {
        updateObj.email = email;
      }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateObj.password = await bcrypt.hash(password, salt);
      }
      const existUser = await UserModel.findById(userId);
      if (!existUser) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      if (req.file) {
        if (existUser.public_id) {
          await cloudinary.uploader.destroy(existUser.public_id);
        }
        updateObj.profileImage = req.file.path;
        updateObj.public_id = req.file.filename;
      }
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateObj, {
        new: true,
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
