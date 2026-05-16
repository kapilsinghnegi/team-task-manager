import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/axios";
import { setUser } from "../../store/authSlice";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(!user);

  useEffect(() => {
    if (user) return;

    const loadUser = async () => {
      try {
        const response = await api.get("/auth/me");
        dispatch(setUser(response.data.user));
      } catch {
        dispatch(setUser(null));
      } finally {
        setChecking(false);
      }
    };

    loadUser();
  }, [dispatch, user]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
