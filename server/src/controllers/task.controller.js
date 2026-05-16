import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

const TASK_STATUSES = ["todo", "in-progress", "done"];
const TASK_PRIORITIES = ["low", "medium", "high"];

const populateTask = [
  { path: "assignedTo", select: "name email role" },
  { path: "createdBy", select: "name email role" },
  { path: "project", select: "name description members admins" },
];

const sameId = (value, id) => {
  const candidate = value?._id || value;
  return candidate?.equals ? candidate.equals(id) : candidate?.toString() === id.toString();
};

const isProjectAdmin = (project, user) =>
  project.admins.some(adminId => sameId(adminId, user._id));

const isProjectMember = (project, userId) =>
  project.members.some(memberId => sameId(memberId, userId));

const findVisibleTask = async (taskId, user) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) return null;

  const task = await Task.findById(taskId).populate("project");
  if (
    !task ||
    !task.project ||
    (!isProjectMember(task.project, user._id) &&
      !isProjectAdmin(task.project, user))
  ) {
    return null;
  }

  return task;
};

const validateTaskPayload = ({ title, dueDate, assignedTo, priority, status }) => {
  if (!title || !dueDate || !assignedTo) {
    return "Title, due date, and assignee are required";
  }

  if (priority && !TASK_PRIORITIES.includes(priority)) {
    return "Invalid task priority";
  }

  if (status && !TASK_STATUSES.includes(status)) {
    return "Invalid task status";
  }

  if (Number.isNaN(new Date(dueDate).getTime())) {
    return "Invalid due date";
  }

  return null;
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;
    const project = req.project;

    if (!isProjectAdmin(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only project admins can create tasks",
      });
    }

    const validationError = validateTaskPayload({
      title,
      dueDate,
      assignedTo,
      priority,
      status,
    });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!isProjectMember(project, assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Assignee must be a project member",
      });
    }

    const existingTask = await Task.findOne({ project: project._id, title });
    if (existingTask) {
      return res.status(409).json({
        success: false,
        message: "A task with this title already exists in this project",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      status: status || "todo",
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      project: project._id,
    });

    await task.populate(populateTask);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A task with this title already exists in this project",
      });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const filter = { project: req.params.projectId };

    if (!isProjectAdmin(req.project, req.user)) {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1 }).populate(populateTask);
    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id }).select("_id");
    const projectIds = projects.map(project => project._id);
    const tasks = await Task.find({
      project: { $in: projectIds },
      $or: [
        { assignedTo: req.user._id },
        ...(req.user.role === "admin" ? [{}] : []),
      ],
    })
      .sort({ dueDate: 1 })
      .populate(populateTask);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await findVisibleTask(req.params.taskId, req.user);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const admin = isProjectAdmin(task.project, req.user);
    const assignedUser = task.assignedTo?.equals(req.user._id);
    const allowedFields = admin
      ? ["title", "description", "priority", "status", "dueDate", "assignedTo"]
      : ["status"];

    const invalidField = Object.keys(req.body).find(
      field => !allowedFields.includes(field),
    );
    if (invalidField || (!admin && !assignedUser)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this task",
      });
    }

    if (req.body.priority && !TASK_PRIORITIES.includes(req.body.priority)) {
      return res.status(400).json({ success: false, message: "Invalid task priority" });
    }

    if (req.body.status && !TASK_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid task status" });
    }

    if (
      req.body.dueDate &&
      Number.isNaN(new Date(req.body.dueDate).getTime())
    ) {
      return res.status(400).json({ success: false, message: "Invalid due date" });
    }

    if (
      req.body.assignedTo &&
      !isProjectMember(task.project, req.body.assignedTo)
    ) {
      return res.status(400).json({
        success: false,
        message: "Assignee must be a project member",
      });
    }

    Object.assign(task, req.body);
    await task.save();
    await task.populate(populateTask);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A task with this title already exists in this project",
      });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await findVisibleTask(req.params.taskId, req.user);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (!isProjectAdmin(task.project, req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only project admins can delete tasks",
      });
    }

    await task.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const projectFilter =
      req.user.role === "admin" ? {} : { members: req.user._id };
    const projects = await Project.find(projectFilter).select(
      "_id name members admins",
    );
    const projectIds = projects.map(project => project._id);
    const filter = { project: { $in: projectIds } };

    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter).populate(populateTask);
    const now = new Date();
    const byStatus = TASK_STATUSES.reduce(
      (summary, status) => ({ ...summary, [status]: 0 }),
      {},
    );
    const users =
      req.user.role === "admin"
        ? await User.find({}).select("name email role").sort({ name: 1 })
        : await User.find({
            _id: {
              $in: projects.flatMap(project => project.members),
            },
          })
            .select("name email role")
            .sort({ name: 1 });
    const perUser = users.reduce((summary, user) => {
      summary[user._id.toString()] = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        total: 0,
      };
      return summary;
    }, {});

    tasks.forEach(task => {
      byStatus[task.status] += 1;
      const userKey = task.assignedTo?._id?.toString() || "unassigned";
      const userName = task.assignedTo?.name || "Unassigned";
      perUser[userKey] = perUser[userKey] || {
        userId: userKey,
        name: userName,
        email: task.assignedTo?.email || "",
        role: task.assignedTo?.role || "member",
        total: 0,
      };
      perUser[userKey].total += 1;
    });

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data: {
        totalTasks: tasks.length,
        byStatus,
        tasksPerUser: Object.values(perUser),
        overdueTasks: tasks.filter(task => task.status !== "done" && task.dueDate < now),
        projects,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createTask, getProjectTasks, getMyTasks, updateTask, deleteTask, getDashboard };
