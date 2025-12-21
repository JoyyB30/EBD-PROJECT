import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function BankLayout() {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar
        links={[
          { to: "/bank/farmers", label: "View All Farmers" },
          { to: "/bank/loans", label: "View Loan Requests" },
        ]}
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