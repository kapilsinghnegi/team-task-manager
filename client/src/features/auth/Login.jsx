import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "../../components/ui/button";
import { setUser } from "../../store/authSlice";
import { loginUser } from "./authApi";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = event => {
    setForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(form);
      dispatch(setUser(response.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage projects, tasks, and team progress.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="off"
              required
              className="rounded-sm text-sm"
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <ButtonGroup className="w-full">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="off"
                required
                className="rounded-sm text-sm"
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-sm"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </ButtonGroup>
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full rounded-sm hover:bg-primary/95" disabled={loading} type="submit">
            <LogIn className="size-4" />
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              className="font-medium text-foreground underline"
              to="/signup"
            >
              Create an account
            </Link>
          </p>
        </FieldGroup>
      </form>
    </section>
  );
};

export default Login;

