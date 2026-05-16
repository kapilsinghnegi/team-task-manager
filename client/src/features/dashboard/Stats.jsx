import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  ListTodo,
} from "lucide-react";

const Stats = ({ dashboard }) => {
  const stats = useMemo(() => {
    const byStatus = dashboard?.byStatus || {};
    return [
      {
        label: "Total tasks",
        value: dashboard?.totalTasks || 0,
        icon: ListTodo,
      },
      { label: "To do", value: byStatus.todo || 0, icon: FolderKanban },
      {
        label: "In progress",
        value: byStatus["in-progress"] || 0,
        icon: CalendarClock,
      },
      { label: "Done", value: byStatus.done || 0, icon: CheckCircle2 },
    ];
  }, [dashboard]);
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="rounded-lg border bg-background p-4">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Stats;
