import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const signupUser = async (req, res) => {
  const { name, email, password, adminInviteCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Fill all the required fields" });
  }

  let role = "member";

  if (adminInviteCode && adminInviteCode === process.env.ADMIN_INVITE_CODE) {
    role = "admin";
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

const loginUser = () => {};

export { signupUser, loginUser };
