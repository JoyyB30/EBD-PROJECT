import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import { loginFarmer, staffLogin } from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "farmer";
  const isStaff = role === "bank" || role === "admin";

  const roleLabel =
    role === "bank"
      ? "Bank"
      : role === "admin"
      ? "Admin"
      : "Farmer";

  const [form, setForm] = useState({
    username: "",
    password: "",
    pin: "",
  });

  const [error, setError] = useState("");

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (isStaff) {
        if (!form.pin.trim()) {
          setError("Please enter the PIN.");
          return;
        }

        const res = await staffLogin({
          role,
          pin: form.pin.trim(),
        });

        localStorage.setItem("token", res.token);
        localStorage.setItem("role", role);

        navigate(role === "bank" ? "/bank" : "/admin");
        return;
      }

      const res = await loginFarmer({
        username: form.username.trim(),
        password: form.password,
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", "farmer");
      navigate("/farmer");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="panel">
          <Card title={`${roleLabel} Login`}>
            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: 10, maxWidth: 340 }}
            >
              {isStaff ? (
                <input
                  name="pin"
                  placeholder="Enter PIN"
                  value={form.pin}
                  onChange={onChange}
                  required
                />
              ) : (
                <>
                  <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={onChange}
                    required
                  />

                  <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    required
                  />
                </>
              )}

              <button type="submit">
                {isStaff ? "Enter" : "Login"}
              </button>
            </form>

            {error && (
              <p style={{ marginTop: 10, color: "crimson" }}>
                {error}
              </p>
            )}

            {!isStaff ? (
              <>
                <p style={{ marginTop: 10 }}>
                  No account? <Link to="/register">Register</Link>
                </p>
                <p style={{ marginTop: 10 }}>
                  <Link to="/" onClick={() => localStorage.removeItem("role")}>
                    ← Back to Home
                  </Link>
                </p>
              </>
            ) : (
              <p style={{ marginTop: 10 }}>
                <Link to="/" onClick={() => localStorage.removeItem("role")}>
                  ← Back to Home
                </Link>
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}