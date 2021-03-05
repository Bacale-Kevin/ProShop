import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

//*@desc   Auth user and get token
//*@route  POST /api/users/login
//*@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//*@desc   Register a new user
//*@route  POST /api/users
//*@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error(" These user already exists");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
  }
});

//*@desc   Get user profile
//*@route  GET /api/users/profile
//*@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  //* req.user has the id of the logged in user so we can now get the profile
  //* base on the ID of the logged in user

  const user = await User.findById(req.user._id);

  //* In these scenario when registering a user we assign generate a token immidiately
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid user data ");
  }
});

export { authUser, registerUser, getUserProfile };
