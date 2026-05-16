import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
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
import { UserPlus } from "lucide-react";

const AddMember = ({ addMember, memberForm, setMemberForm, message, users }) => {
  return (
    <Card className="rounded-lg border bg-background p-4">
      <CardTitle className="font-semibold">Add member</CardTitle>
      <form className="mt-4 space-y-3" onSubmit={addMember}>
        <FieldGroup>
          <Field>
            <FieldLabel>User</FieldLabel>
            <Select
              value={memberForm.email}
              onValueChange={email =>
                setMemberForm(previous => ({
                  ...previous,
                  email,
                }))
              }
            >
              <SelectTrigger className="w-full rounded-sm">
                <SelectValue placeholder="Select users" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Users</SelectLabel>
                  {users.map(user => (
                    <SelectItem key={user._id} value={user.email}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Select
              value={memberForm.role}
              onValueChange={role =>
                setMemberForm(previous => ({
                  ...previous,
                  role,
                }))
              }
            >
              <SelectTrigger className="w-full rounded-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Project admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          className="hover:bg-primary/95"
          disabled={!memberForm.email}
        >
          <UserPlus className="size-4" />
          Add member
        </Button>
      </form>
      {message && (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      )}
    </Card>
  );
};

export default AddMember;
