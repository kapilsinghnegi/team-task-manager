import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../utils/axios";
import Stats from "./Stats";
import OverdueTasks from "./OverdueTasks";
import CreateProject from "./CreateProject";
import TasksPerUser from "./TasksPerUser";
import Projects from "./Projects";

const Dashboard = () => {
  const [message, setMessage] = useState("");

  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === "admin";
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [dashboardResponse, projectsResponse] = await Promise.all([
      api.get("/tasks/dashboard"),
      api.get("/projects"),
    ]);
    setDashboard(dashboardResponse.data.data);
    setProjects(projectsResponse.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData().catch(() => {
      setMessage("Unable to load dashboard data");
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading dashboard...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Project workload, overdue tasks, and team ownership at a glance.
        </p>
      </div>

      <Stats dashboard={dashboard} />

      <div
        className={`grid gap-6 ${isAdmin ? "lg:grid-cols-[1fr_360px]" : ""}`}
      >
        <OverdueTasks overdueTasks={dashboard?.overdueTasks} />

        {isAdmin && (
          <CreateProject
            loadData={loadData}
            message={message}
            setMessage={setMessage}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TasksPerUser tasksPerUser={dashboard?.tasksPerUser} />
        <Projects projects={projects} />
      </div>
    </div>
  );
};

export default Dashboard;
