import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { getAllFarmers } from "../../api/bank";

export default function AdminFarmersPage() {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const data = await getAllFarmers();
      setFarmers(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="panel">
          <div className="page-header">
            <div>
              <h2 className="page-title">Admin</h2>
              <p className="page-subtitle">
                View all farmers and open their details.
              </p>
            </div>

            <button className="btn-primary" onClick={load}>
              Refresh
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {err && (
            <p style={{ color: "crimson", marginTop: 10 }}>
              {err}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: 14,
            }}
          >
            {farmers.map((f) => (
              <Card key={f._id} title={f.username}>
                <p style={{ margin: "0 0 6px 0" }}>
                  <b>ID:</b> {String(f._id).slice(0, 18)}...
                </p>

                <p style={{ margin: "0 0 6px 0" }}>
                  <b>Phone:</b> {f.phone}
                </p>

                <p style={{ margin: "0 0 12px 0" }}>
                  <b>National ID:</b> {f.nationalID}
                </p>

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/admin/farmers/${f._id}`)}
                >
                  View Details
                </button>
              </Card>
            ))}

            {!loading && farmers.length === 0 && (
              <p style={{ marginTop: 10 }}>
                No farmers found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}