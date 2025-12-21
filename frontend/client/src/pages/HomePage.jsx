import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  function goFarmer() {
    localStorage.removeItem("role");
    navigate("/register");
  }

  function goBank() {
    localStorage.setItem("role", "bank");
    navigate("/login");
  }

  function goAdmin() {
    localStorage.setItem("role", "admin");
    navigate("/login");
  }

  return (
    <div className="page">
      <div className="container" style={{ textAlign: "center" }}>
        <img className="home-logo" src="/logo.png" alt="FarmConnect" />
        <p className="home-subtitle">Choose your role to continue</p>

        <div className="home-grid">
          <Card title="Farmer">
            <button className="btn-primary" onClick={goFarmer}>
              Continue as Farmer
            </button>
          </Card>

          <Card title="Bank">
            <button className="btn-primary" onClick={goBank}>
              Continue as Bank
            </button>
          </Card>

          <Card title="Admin">
            <button className="btn-primary" onClick={goAdmin}>
              Continue as Admin
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}