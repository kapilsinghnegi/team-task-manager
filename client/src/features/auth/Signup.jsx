import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { signupUser } from "./authApi";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminInviteCode: "",
  });
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
      await signupUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm my-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Start a workspace, join projects, and track work with your team.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autocomplete="name"
              placeholder="Enter your name"
              className="rounded-sm text-sm"
            />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              autocomplete="email"
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
                autocomplete="new-password"
                required
                placeholder="At least 8 characters"
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
          <Field>
            <FieldLabel>Admin invite code</FieldLabel>
            <Input
              name="adminInviteCode"
              value={form.adminInviteCode}
              onChange={handleChange}
              placeholder="Optional"
              className="rounded-sm text-sm"
            />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            className="w-full rounded-sm hover:bg-primary/95"
            disabled={loading}
            type="submit"
          >
            <UserPlus className="size-4" />
            {loading ? "Creating..." : "Create account"}
          </Button>
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-foreground underline" to="/login">
              Sign in
            </Link>
          </p>
        </FieldGroup>
      </form>
    </section>
  );
};

export default Signup;

