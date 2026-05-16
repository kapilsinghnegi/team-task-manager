import { useEffect, useMemo, useState } from "react";
import api from "../../utils/axios";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectMembers from "./ProjectMembers";
import AddMember from "./AddMember";

const Team = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [memberForm, setMemberForm] = useState({ email: "", role: "member" });
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    const [projectsResponse, usersResponse] = await Promise.all([
      api.get("/projects"),
      api.get("/users"),
    ]);
    const loadedProjects = projectsResponse.data.data;
    setProjects(loadedProjects);
    setUsers(usersResponse.data.data);
    setProjectId(current => current || loadedProjects[0]?._id || "");
  };

  useEffect(() => {
    loadProjects().catch(() => setMessage("Unable to load team data"));
  }, []);

  const selectedProject = useMemo(
    () => projects.find(project => project._id === projectId),
    [projects, projectId],
  );
  const availableUsers = useMemo(() => {
    const memberEmails = new Set(
      selectedProject?.members?.map(member => member.email) || [],
    );
    return users.filter(user => !memberEmails.has(user.email));
  }, [selectedProject, users]);

  const addMember = async event => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await api.post(
        `/projects/${projectId}/members`,
        memberForm,
      );
      setProjects(previous =>
        previous.map(project =>
          project._id === projectId ? response.data.data : project,
        ),
      );
      setMemberForm({ email: "", role: "member" });
      setMessage("Member added");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to add member");
    }
  };

  const removeMember = async userId => {
    setMessage("");

    try {
      const response = await api.delete(
        `/projects/${projectId}/members/${userId}`,
      );
      setProjects(previous =>
        previous.map(project =>
          project._id === projectId ? response.data.data : project,
        ),
      );
      setMessage("Member removed");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to remove member");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold">Team</h2>
          <p className="text-sm text-muted-foreground">
            Add project members, promote project admins, and remove users from
            teams.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Project</Label>
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
        </div>
      </div>

      {!projects.length ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">
          Create a project from the dashboard before managing a team.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <ProjectMembers
            project={selectedProject}
            removeMember={removeMember}
          />
          <AddMember
            addMember={addMember}
            memberForm={memberForm}
            setMemberForm={setMemberForm}
            message={message}
            users={availableUsers}
          />
        </div>
      )}
    </div>
  );
};

export default Team;

