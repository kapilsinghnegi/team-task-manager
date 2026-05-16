import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import api from "../../utils/axios";
import { logoutUser } from "../../store/authSlice";
import { Button } from "../ui/button";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-4">
      <div>
        <h1 className="text-base sm:text-xl font-semibold">Team Task Manager</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {user?.name} · {user?.role}
        </p>
      </div>

      <Button variant="destructive" onClick={handleLogout}>
        <LogOut className="size-4" />
        Logout
      </Button>
    </header>
  );
}
