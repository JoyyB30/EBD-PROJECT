import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function FarmerLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div>
      <NavBar
        links={[
          { to: "/farmer", label: "Dashboard" },
          { to: "/farmer/sales", label: "Sales" },
          { to: "/farmer/purchases", label: "Purchases" },
          { to: "/farmer/summary", label: "Summary" },
          { to: "/farmer/loans", label: "Loan Request" },
        ]}
        onLogout={logout}
      />

      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}