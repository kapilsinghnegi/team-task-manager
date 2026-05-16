import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

const createProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const selectedEmails = members
      .map(member => (typeof member === "string" ? member : member?.email))
      .filter(Boolean)
      .map(email => email.toLowerCase().trim());

    const selectedUsers = selectedEmails.length
      ? await User.find({ email: { $in: selectedEmails } }).select("_id role email")
      : [];

    if (selectedUsers.length !== new Set(selectedEmails).size) {
      return res.status(400).json({
        success: false,
        message: "One or more selected users could not be found",
      });
    }

    const memberIds = [
      req.user._id,
      ...selectedUsers.map(user => user._id),
    ].filter(
      (memberId, index, allIds) =>
        allIds.findIndex(id => id.equals(memberId)) === index,
    );
    const adminIds = [
      req.user._id,
      ...selectedUsers
        .filter(user => user.role === "admin")
        .map(user => user._id),
    ].filter(
      (adminId, index, allIds) =>
        allIds.findIndex(id => id.equals(adminId)) === index,
    );

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      admins: adminIds,
      members: memberIds,
    });
    await project.populate([
      { path: "members", select: "name email role" },
      { path: "admins", select: "name email role" },
    ]);

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
    const filter = req.user.role === "admin" ? {} : { members: req.user._id };
    const projects = await Project.find(filter)
      .populate("members", "name email role")
      .populate("admins", "name email role");

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

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      members: req.user._id,
    })
      .populate("members", "name email role")
      .populate("admins", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addProjectMember = async (req, res) => {
  try {
    const { email, role = "member" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const project = req.project;
    if (!project.members.some(memberId => memberId.equals(user._id))) {
      project.members.push(user._id);
    }

    if (
      role === "admin" &&
      !project.admins.some(adminId => adminId.equals(user._id))
    ) {
      project.admins.push(user._id);
    }

    await project.save();
    await project.populate([
      { path: "members", select: "name email role" },
      { path: "admins", select: "name email role" },
    ]);

    res.status(200).json({
      success: true,
      message: "Project member added successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeProjectMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const project = req.project;

    if (project.createdBy.equals(userId)) {
      return res.status(400).json({
        success: false,
        message: "Project creator cannot be removed",
      });
    }

    project.members = project.members.filter(memberId => !memberId.equals(userId));
    project.admins = project.admins.filter(adminId => !adminId.equals(userId));

    await Task.updateMany(
      { project: project._id, assignedTo: userId },
      { $unset: { assignedTo: "" } },
    );
    await project.save();
    await project.populate([
      { path: "members", select: "name email role" },
      { path: "admins", select: "name email role" },
    ]);

    res.status(200).json({
      success: true,
      message: "Project member removed successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createProject,
  getProjects,
  getProject,
  addProjectMember,
  removeProjectMember,
};
