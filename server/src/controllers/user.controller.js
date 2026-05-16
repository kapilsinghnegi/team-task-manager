import User from "../models/user.model.js";

const getUsers = async (_, res) => {
  try {
    const users = await User.find({}).select("name email role").sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getUsers };
