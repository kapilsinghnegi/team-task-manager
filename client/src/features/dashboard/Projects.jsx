import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const Projects = ({ projects }) => {
  return (
    <Card className="rounded-lg border bg-background">
      <CardHeader className="border-b">
        <CardTitle className="font-semibold">Projects</CardTitle>
      </CardHeader>
      <div className="divide-y">
        {projects.length ? (
          projects.map(project => (
            <div key={project._id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{project.name}</p>
                <span className="text-sm text-muted-foreground">
                  {project.members?.length || 0} members
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description || "No description"}
              </p>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            You are not a member of any project yet.
          </p>
        )}
      </div>
    </Card>
  );
};

export default Projects;
