import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";

export default function FarmerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="panel">
        <div className="page-header">
          <div>
            <h2 className="page-title">Farmer Dashboard</h2>
            <p className="page-subtitle">
              Quick actions to manage your records
            </p>
          </div>
        </div>

        <Card title="Quick Actions">
          <div className="actions" style={{ justifyContent: "flex-start" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/farmer/sales")}
            >
              Sales
            </button>

            <button
              className="btn-primary"
              onClick={() => navigate("/farmer/purchases")}
            >
              Purchases
            </button>

            <button
              className="btn-primary"
              onClick={() => navigate("/farmer/summary")}
            >
              Summary
            </button>

            <button
              className="btn-primary"
              onClick={() => navigate("/farmer/loans")}
            >
              Loan Request
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}