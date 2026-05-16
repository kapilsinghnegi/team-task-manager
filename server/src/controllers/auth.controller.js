import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const signupUser = async (req, res) => {
  const { name, email, password, adminInviteCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Fill all the required fields" });
  }

  let role;

  if (adminInviteCode && adminInviteCode === process.env.ADMIN_INVITE_CODE) {
    role = "admin";
  } else {
    role = "member";
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fill all the required fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

const logoutUser = (_, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export { signupUser, loginUser, logoutUser, getMe };
