const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// REGISTER
const register = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    // Check empty fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
  message: "User registered successfully",
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
  },
});

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};



// LOGIN
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
  message: "Login successful",
  token,
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    status: user.status,
  },
});

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

const getUsers = async (req, res) => {

  try {

    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "status",
      ],
    });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  register,
  login,
  getUsers,
};