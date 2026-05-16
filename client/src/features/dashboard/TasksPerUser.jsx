import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const TasksPerUser = ({ tasksPerUser }) => {
  return (
    <Card className="rounded-lg border bg-background">
      <CardHeader className="border-b">
        <CardTitle className="font-semibold">Tasks per user</CardTitle>
      </CardHeader>
      <div className="divide-y">
        {tasksPerUser?.length ? (
          tasksPerUser.map(item => (
            <div
              key={item.userId}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.email || "No email"} - {item.role}
                </p>
              </div>
              <span className="font-semibold">{item.total}</span>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            No assigned tasks yet.
          </p>
        )}
      </div>
    </Card>
  );
};

export default TasksPerUser;
