import Task from "../models/task.model.js";

const validateUpdateTask = req => {
  const allowedFields = [
    "title",
    "description",
    "priority",
    "status",
    "dueDate",
    "assignedTo",
  ];
  const isAllowed = Object.keys(req.body).every(field =>
    allowedFields.includes(field),
  );
  return isAllowed;
};

const createTask = async (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    dueDate,
    assignedTo,
    createdBy,
  } = req.body;

  if (!title || !dueDate || !assignedTo || !createdBy) {
    return res.status(400).json({ message: "Fill all the required fields" });
  }

  if (
    !["low", "medium", "high"].includes(priority) ||
    !["todo", "in-progress", "completed"].includes(status)
  ) {
    return res.status(400).json({ message: "Invalid task details" });
  }

  if (new Date(dueDate) < new Date()) {
    return res.status(400).json({ message: "Due date cannot be in the past" });
  }

  try {
    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res.status(409).json({ message: "Task already exists" });
    }
    const task = new Task({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      createdBy,
    });
    await task.save();
    await task.populate([
      { path: "assignedTo", select: "name email role" },
      { path: "createdBy", select: "name email role" },
    ]);
    return res
      .status(201)
      .json({ message: "Task created successfully", data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating task" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate([
      { path: "assignedTo", select: "name email role" },
      { path: "createdBy", select: "name email role" },
    ]);
    return res
      .status(200)
      .json({ message: "Tasks fetched successfully", data: tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching tasks" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate([
      { path: "assignedTo", select: "name email role" },
      { path: "createdBy", select: "name email role" },
    ]);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res
      .status(200)
      .json({ message: "Task fetched successfully", data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!validateUpdateTask(req)) {
      return res.status(400).json({ message: "Invalid task details" });
    }

    if (req.body.dueDate && new Date(req.body.dueDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Due date cannot be in the past" });
    }

    Object.assign(task, req.body);

    const updatedTask = await task.save();

    return res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating task" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!["todo", "in-progress", "completed"].includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    if (task.status === req.body.status) {
      return res
        .status(400)
        .json({ message: "Task status is already updated" });
    }

    task.status = req.body.status;

    const updatedTask = await task.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    return res
      .status(200)
      .json({ message: "Task deleted successfully", data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting task" });
  }
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
