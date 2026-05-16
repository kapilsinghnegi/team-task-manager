import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

export default function Sidebar() {
  const { user } = useSelector(state => state.auth);
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: user?.role === "admin" ? "/tasks/manage" : "/my-tasks",
      label: "Tasks",
      icon: ClipboardList,
    },
    ...(user?.role === "admin"
      ? [
          { to: "/tasks/create", label: "New Task", icon: Plus },
          { to: "/team", label: "Team", icon: Users },
        ]
      : []),
  ];

  return (
    <aside className="w-20 border-r bg-sidebar p-4 md:block">
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <div>
            <DrawerTitle className="cursor-pointer flex items-center gap-2">
              <span>TTM.</span>
            </DrawerTitle>
            <nav className="mt-8 space-y-4">
              {links.map(({ to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center rounded-sm px-3 py-2 text-sm ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="size-5" />
                </NavLink>
              ))}
            </nav>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Team Task Manager</DrawerTitle>
            <DrawerDescription>Fewer meetings, more doing.</DrawerDescription>
          </DrawerHeader>
          <nav className="space-y-2 px-6">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-sm px-3 py-2 text-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </aside>
  );
}
