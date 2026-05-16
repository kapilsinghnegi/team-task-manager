import { useEffect, useMemo, useState } from "react";
import { Check, Edit, Save, Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../utils/axios";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const statuses = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityClass = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const formatDateForInput = date => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
};

const ManageTasks = ({ mine = false }) => {
  const { user } = useSelector(state => state.auth);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
    assignedTo: "",
  });

  useEffect(() => {
    const loadProjects = async () => {
      const response = await api.get("/projects");
      setProjects(response.data.data);
      setProjectId(response.data.data[0]?._id || "");
      setLoading(false);
    };

    loadProjects().catch(() => {
      setMessage("Unable to load projects");
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      if (mine) {
        const response = await api.get("/tasks/mine");
        setTasks(response.data.data);
        return;
      }

      if (!projectId) {
        setTasks([]);
        return;
      }

      const response = await api.get(`/tasks/project/${projectId}`);
      setTasks(response.data.data);
      setEditingTaskId("");
    };

    loadTasks().catch(err => {
      setMessage(err.response?.data?.message || "Unable to load tasks");
    });
  }, [mine, projectId]);

  const groupedTasks = useMemo(
    () =>
      statuses.map(status => ({
        ...status,
        tasks: tasks.filter(task => task.status === status.value),
      })),
    [tasks],
  );
  const selectedProject = useMemo(
    () => projects.find(project => project._id === projectId),
    [projectId, projects],
  );
  const canManageTask = task =>
    task.project?.admins?.some(adminId => adminId === user?._id) ||
    selectedProject?.admins?.some(admin => admin._id === user?._id);

  const startEdit = task => {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      dueDate: formatDateForInput(task.dueDate),
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo?._id || "",
    });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingTaskId("");
    setMessage("");
  };

  const handleEditChange = event => {
    setEditForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const setEditValue = (name, value) => {
    setEditForm(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveTask = async taskId => {
    setMessage("");
    try {
      const response = await api.patch(`/tasks/${taskId}`, editForm);
      setTasks(previous =>
        previous.map(task => (task._id === taskId ? response.data.data : task)),
      );
      setEditingTaskId("");
      setMessage("Task updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update task");
    }
  };

  const updateStatus = async (taskId, status) => {
    setMessage("");
    try {
      const response = await api.patch(`/tasks/${taskId}`, { status });
      setTasks(previous =>
        previous.map(task => (task._id === taskId ? response.data.data : task)),
      );
      setMessage("Task updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update task");
    }
  };

  const deleteTask = async taskId => {
    setMessage("");
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(previous => previous.filter(task => task._id !== taskId));
      setMessage("Task deleted");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to delete task");
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading tasks...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold">
            {mine ? "My tasks" : "Tasks"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Update progress, review assignments, and keep due dates visible.
          </p>
        </div>
        {!mine && (
          <Field>
            <FieldLabel>Project</FieldLabel>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="rounded-sm">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Projects</SelectLabel>
                  {projects.map(project => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      {!projects.length && !mine ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">
          Create a project from the dashboard before adding tasks.
        </p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {groupedTasks.map(group => (
            <Card key={group.value} className="rounded-lg border bg-background">
              <CardHeader className="flex items-center justify-between border-b">
                <CardTitle className="font-semibold">{group.label}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {group.tasks.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {group.tasks.length ? (
                  group.tasks.map(task => (
                    <article key={task._id} className="rounded-lg border p-4">
                      {editingTaskId === task._id ? (
                        <div className="space-y-3">
                          <Input
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            placeholder="Task title"
                            className="rounded-sm text-sm"
                          />
                          <Textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            placeholder="Description"
                            className="resize-none rounded-sm text-sm"
                          />
                          <FieldGroup className="grid gap-3 sm:grid-cols-2">
                            <Field>
                              <FieldLabel className="text-muted-foreground">
                                Due date
                              </FieldLabel>
                              <Input
                                name="dueDate"
                                type="date"
                                value={editForm.dueDate}
                                onChange={handleEditChange}
                                className="rounded-sm text-sm"
                              />
                            </Field>
                            <Field>
                              <FieldLabel className="text-muted-foreground">
                                Assignee
                              </FieldLabel>
                              <Select
                                value={editForm.assignedTo}
                                onValueChange={value =>
                                  setEditValue("assignedTo", value)
                                }
                                className="rounded-sm text-sm"
                              >
                                <SelectTrigger className="rounded-sm">
                                  <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Project members</SelectLabel>
                                    {selectedProject?.members?.map(member => (
                                      <SelectItem
                                        key={member._id}
                                        value={member._id}
                                      >
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field>
                              <FieldLabel className="text-muted-foreground">
                                Priority
                              </FieldLabel>
                              <Select
                                value={editForm.priority}
                                onValueChange={value =>
                                  setEditValue("priority", value)
                                }
                                className="rounded-sm text-sm"
                              >
                                <SelectTrigger className="rounded-sm">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Priorities</SelectLabel>
                                    {priorities.map(priority => (
                                      <SelectItem
                                        key={priority.value}
                                        value={priority.value}
                                      >
                                        {priority.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field>
                              <FieldLabel className="text-muted-foreground">
                                Status
                              </FieldLabel>
                              <Select
                                value={editForm.status}
                                onValueChange={value =>
                                  setEditValue("status", value)
                                }
                                className="rounded-sm text-sm"
                              >
                                <SelectTrigger className="rounded-sm">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {statuses.map(status => (
                                      <SelectItem
                                        key={status.value}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </Field>
                          </FieldGroup>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveTask(task._id)}
                              className="flex-1 hover:bg-primary/95"
                            >
                              <Save className="size-3" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="flex-1"
                            >
                              <X className="size-3" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between gap-3">
                            <div>
                              <h4 className="text-base font-medium">
                                {task.title}
                              </h4>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {task.description || "No description"}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <Badge
                                className={`rounded-md px-2 py-1 text-xs font-medium ${
                                  priorityClass[task.priority]
                                } capitalize`}
                              >
                                {task.priority}
                              </Badge>
                              <Select
                                className="text-sm rounded-sm"
                                value={task.status}
                                defaultValue={task.status}
                                onValueChange={status =>
                                  updateStatus(task._id, status)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {statuses.map(status => (
                                      <SelectItem
                                        key={status.value}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <dl className="mt-4 grid gap-2 text-sm">
                            <div className="flex justify-between gap-4">
                              <dt className="text-muted-foreground">
                                Assignee
                              </dt>
                              <dd>{task.assignedTo?.name || "Unassigned"}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                              <dt className="text-muted-foreground">Project</dt>
                              <dd>{task.project?.name}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                              <dt className="text-muted-foreground">Due</dt>
                              <dd>
                                {new Date(task.dueDate).toLocaleDateString(
                                  "en-GB",
                                )}
                              </dd>
                            </div>
                          </dl>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {canManageTask(task) && !mine && (
                              <>
                                <Button
                                  onClick={() => startEdit(task)}
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Edit className="size-3" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => deleteTask(task._id)}
                                  size="sm"
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <Trash2 className="size-3" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    No tasks here.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTasks;

