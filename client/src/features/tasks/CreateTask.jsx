import { useEffect, useMemo, useState } from "react";
import api from "../../utils/axios";
import { Button } from "../../components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "todo",
  assignedTo: "",
};

const CreateTask = () => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      const response = await api.get("/projects");
      const loadedProjects = response.data.data;
      setProjects(loadedProjects);
      setProjectId(loadedProjects[0]?._id || "");
      setForm(previous => ({
        ...previous,
        assignedTo: loadedProjects[0]?.members?.[0]?._id || "",
      }));
    };

    loadProjects().catch(() => setMessage("Unable to load projects"));
  }, []);

  const selectedProject = useMemo(
    () => projects.find(project => project._id === projectId),
    [projectId, projects],
  );

  const handleChange = (name, value) => {
    console.log(name, value);
    setForm(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProjectChange = projectId => {
    const nextProjectId = projectId;
    const nextProject = projects.find(project => project._id === nextProjectId);
    setProjectId(nextProjectId);
    setForm(previous => ({
      ...previous,
      assignedTo: nextProject?.members?.[0]?._id || "",
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setMessage("");

    try {
      await api.post(`/tasks/project/${projectId}`, form);
      setForm({
        ...initialForm,
        assignedTo: selectedProject?.members?.[0]?._id || "",
      });
      setMessage("Task created successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to create task");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create task</h2>
        <p className="text-sm text-muted-foreground">
          Add a task to a project and assign it to a team member.
        </p>
      </div>

      {!projects.length ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">
          Create a project from the dashboard before adding tasks.
        </p>
      ) : (
        <form
          className="rounded-lg border bg-background p-5"
          onSubmit={handleSubmit}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Project</FieldLabel>
              <Select
                value={projectId}
                onValueChange={handleProjectChange}
                required
              >
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
            <Field>
              <FieldLabel>Assignee</FieldLabel>
              <Select
                value={form.assignedTo}
                onValueChange={value => handleChange("assignedTo", value)}
                name="assignedTo"
                required
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select an assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Assignees</SelectLabel>
                    {selectedProject?.members?.map(member => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <FieldGroup className="mt-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                name="title"
                value={form.title}
                onChange={e => handleChange("title", e.target.value)}
                placeholder="Task title"
                required
                className="rounded-sm text-sm"
              />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
                placeholder="Task description"
                className="text-sm rounded-sm resize-none"
              />
            </Field>
            <Field>
              <FieldLabel>Due Date</FieldLabel>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={e => handleChange("dueDate", e.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="mt-4 grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select
                name="priority"
                value={form.priority}
                onValueChange={value => handleChange("priority", value)}
                className="rounded-sm text-sm"
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Priorities</SelectLabel>
                    {[
                      { name: "Low", value: "low" },
                      { name: "Medium", value: "medium" },
                      { name: "High", value: "high" },
                    ].map(priority => (
                      <SelectItem key={priority.name} value={priority.value}>
                        {priority.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                name="status"
                value={form.status}
                onValueChange={value => handleChange("status", value)}
                className="rounded-sm text-sm"
              >
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {[
                      { name: "To Do", value: "todo" },
                      { name: "In Progress", value: "in-progress" },
                      { name: "Done", value: "done" },
                    ].map(status => (
                      <SelectItem key={status.name} value={status.value}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="mt-4 w-full flex items-center gap-3">
            <Button type="submit" className="hover:bg-primary/95">
              <Plus className="size-4" />
              Create task
            </Button>
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateTask;

