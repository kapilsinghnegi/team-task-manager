import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OverdueTasks = ({ overdueTasks }) => {
  return (
    <Card className="rounded-lg border bg-background">
      <CardHeader className="border-b">
        <CardTitle className="font-semibold">Overdue tasks</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {overdueTasks?.length ? (
          overdueTasks.map(task => (
            <div
              key={task._id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  {task.project?.name} - {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              <span className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted-foreground">No overdue tasks.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueTasks;
