import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar
        links={[{ to: "/admin/farmers", label: "View Farmers" }]}
        onLogout={() => {
          localStorage.removeItem("role");
          navigate("/");
        }}
      />
      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}