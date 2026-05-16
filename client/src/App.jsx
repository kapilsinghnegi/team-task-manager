import { Provider } from "react-redux";
import store from "./store/store";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./features/dashboard/Dashboard";
import ManageTasks from "./features/tasks/ManageTasks";
import CreateTask from "./features/tasks/CreateTask";
import Team from "./features/team/Team";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/tasks/manage", element: <ManageTasks /> },
      { path: "/my-tasks", element: <ManageTasks mine /> },
      {
        path: "/tasks/create",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateTask />
          </ProtectedRoute>
        ),
      },
      {
        path: "/team",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Team />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}
