import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { getAllFarmers } from "../../api/bank";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      setError("");
      const data = await getAllFarmers();
      setFarmers(data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <div className="panel">
        <div className="page-header">
          <div>
            <h2 className="page-title">All Farmers</h2>
            <p className="page-subtitle">
              Browse farmers and view their details
            </p>
          </div>

          <button className="btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <Card title="Farmers List">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>National ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {farmers.map((f) => (
                  <tr key={f._id}>
                    <td>{String(f._id).slice(0, 18)}...</td>
                    <td>{f.username}</td>
                    <td>{f.phone}</td>
                    <td>{f.nationalID}</td>
                    <td>
                      <button
                        className="btn-primary"
                        onClick={() =>
                          navigate(`/bank/farmers/${f._id}`)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}

                {farmers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 10 }}>
                      No farmers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}