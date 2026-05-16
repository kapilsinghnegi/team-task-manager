import Project from "../models/project.model.js";

const sameId = (value, id) => {
  const candidate = value?._id || value;
  return candidate?.equals ? candidate.equals(id) : candidate?.toString() === id.toString();
};

const isProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      project.members.some(memberId => sameId(memberId, req.user._id)) ||
      project.admins.some(adminId => sameId(adminId, req.user._id));

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.project = project;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const isProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const project = req.project || (await Project.findById(projectId));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isAdmin = project.admins.some(adminId => sameId(adminId, req.user._id));

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only project admins can perform this action",
      });
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { isProjectMember, isProjectAdmin };
