import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 px-4">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
