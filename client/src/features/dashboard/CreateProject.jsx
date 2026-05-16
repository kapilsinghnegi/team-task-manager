import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import api from "@/utils/axios";

const CreateProject = ({ loadData, message, setMessage }) => {
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const response = await api.get("/users");
      setUsers(response.data.data);
    };

    loadUsers().catch(() => setMessage("Unable to load users"));
  }, [setMessage]);

  const availableUsers = useMemo(
    () => users.filter(user => !members.some(member => member.email === user.email)),
    [members, users],
  );

  const addSelectedMember = () => {
    const user = users.find(item => item.email === selectedEmail);
    if (!user) return;

    setMembers(previous => [...previous, user]);
    setSelectedEmail("");
  };

  const removeMember = email => {
    setMembers(previous => previous.filter(member => member.email !== email));
  };

  const handleCreateProject = async event => {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/projects", {
        ...projectForm,
        members: members.map(member => ({ email: member.email })),
      });
      setProjectForm({ name: "", description: "" });
      setMembers([]);
      setSelectedEmail("");
      setMessage("Project created successfully");
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to create project");
    }
  };
  return (
    <Card className="rounded-lg border bg-background p-4">
      <CardTitle className="font-semibold">Create project</CardTitle>
      <form className="mt-4 space-y-3" onSubmit={handleCreateProject}>
        <FieldGroup>
          <Field>
            <Input
              placeholder="Project name"
              value={projectForm.name}
              onChange={event =>
                setProjectForm(previous => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              required
              className="rounded-sm text-sm"
            />
            <Textarea
              placeholder="Description"
              value={projectForm.description}
              onChange={event =>
                setProjectForm(previous => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
              className="text-sm rounded-sm resize-none"
            />
          </Field>
          <Field>
            <Label>Initial members</Label>
            <div className="flex gap-2">
              <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                <SelectTrigger className="w-full rounded-sm">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    {availableUsers.map(user => (
                      <SelectItem key={user._id} value={user.email}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={addSelectedMember}
                disabled={!selectedEmail}
              >
                Add
              </Button>
            </div>
            {members.length ? (
              <div className="flex flex-wrap gap-2">
                {members.map(member => (
                  <button
                    key={member.email}
                    type="button"
                    onClick={() => removeMember(member.email)}
                    className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {member.name} x
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                The creator is added automatically. Select additional members.
              </p>
            )}
          </Field>
          <Button type="submit">Create project</Button>
          {message && (
            <p className="mt-3 text-sm text-muted-foreground">{message}</p>
          )}
        </FieldGroup>
      </form>
    </Card>
  );
};

export default CreateProject;
