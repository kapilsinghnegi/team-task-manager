import Task from "../models/task.model.js";
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
    return res
      .status(201)
      .json({ message: "Task created successfully", data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating task" });
  }
};

const getAllTasks = async (req, res) => {};

const getTaskById = async (req, res) => {};

const updateTask = async (req, res) => {};

const updateTaskStatus = async (req, res) => {};

const deleteTask = async (req, res) => {};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
