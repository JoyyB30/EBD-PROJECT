import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import { registerFarmer } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    phone: "",
    nationalID: "",
    password: "",
  });

  const [error, setError] = useState("");

  function digitsOnly(value) {
    return value.replace(/\D/g, "");
  }

  function onChange(e) {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((p) => ({
        ...p,
        phone: digitsOnly(value).slice(0, 11),
      }));
      return;
    }

    if (name === "nationalID") {
      setForm((p) => ({
        ...p,
        nationalID: digitsOnly(value).slice(0, 14),
      }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!/^\d{11}$/.test(form.phone)) {
      setError("Phone number must be exactly 11 digits");
      return;
    }

    if (!/^\d{14}$/.test(form.nationalID)) {
      setError("National ID must be exactly 14 digits");
      return;
    }

    try {
      const res = await registerFarmer(form);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", "farmer"); // important
        navigate("/farmer");
        return;
      }

      // if backend doesn't return token, send to login (better UX than /farmer)
      setError("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="panel">
          <Card title="Farmer Register">
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 340 }}>
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={onChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone (11 digits)"
                value={form.phone}
                onChange={onChange}
                inputMode="numeric"
                pattern="\d{11}"
                maxLength={11}
                required
              />

              <input
                name="nationalID"
                placeholder="National ID (14 digits)"
                value={form.nationalID}
                onChange={onChange}
                inputMode="numeric"
                pattern="\d{14}"
                maxLength={14}
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

              <button type="submit">Create Account</button>
            </form>

            {error && <p style={{ marginTop: 10, color: "crimson" }}>{error}</p>}

            <p style={{ marginTop: 10 }}>
              Already have an account? <Link to="/login">Login</Link>
            </p>

            <p style={{ marginTop: 10 }}>
              <Link to="/" onClick={() => localStorage.removeItem("role")}>
                ← Back to Home
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}