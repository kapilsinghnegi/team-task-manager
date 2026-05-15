import Project from "../models/project.model.js";

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      admins: [req.user._id],
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate("members", "name email")
      .populate("admins", "name email");

    if (!projects) {
      return res.status(404).json({ message: "Projects not found" });
    }

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createProject, getProjects };
