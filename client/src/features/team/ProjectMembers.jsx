import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const ProjectMembers = ({ project, removeMember }) => {
  return (
    <Card className="rounded-lg border bg-background">
      <CardHeader className="border-b">
        <CardTitle>{project?.name} members</CardTitle>
      </CardHeader>
      <div className="divide-y">
        {project?.members?.map(member => {
          const projectAdmin = project.admins?.some(
            admin => admin._id === member._id,
          );

          return (
            <div
              key={member._id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize">
                  {projectAdmin ? "Project admin" : member.role}
                </span>
                {!projectAdmin && (
                  <Button
                    onClick={() => removeMember(member._id)}
                    size="icon-sm"
                    title="Remove member"
                    variant="destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProjectMembers;
