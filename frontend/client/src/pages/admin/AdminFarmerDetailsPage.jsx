import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/Card";

import { getSalesForFarmer } from "../../api/sales";
import { getPurchasesForFarmer } from "../../api/purchases";
import { getLoansForFarmer } from "../../api/loans";

export default function AdminFarmerDetailsPage() {
  const { farmerId } = useParams();

  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");

      if (!farmerId) {
        setError("Missing farmerId in URL.");
        return;
      }

      const [s, p, l] = await Promise.all([
        getSalesForFarmer(farmerId),
        getPurchasesForFarmer(farmerId),
        getLoansForFarmer(farmerId),
      ]);

      setSales(s || []);
      setPurchases(p || []);
      setLoans(l || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId]);

  const purchasesBySupplier = useMemo(() => {
    const map = (purchases || []).reduce((acc, p) => {
      const key = (p.supplierId && String(p.supplierId).trim()) || "No Supplier";
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {});

    const entries = Object.entries(map).sort(([a], [b]) => {
      if (a === "No Supplier") return 1;
      if (b === "No Supplier") return -1;
      return a.localeCompare(b);
    });

    return entries;
  }, [purchases]);

  return (
    <div className="page">
      <div className="container">
        <div className="panel">
          <div className="page-header">
            <div>
              <h2 className="page-title">Admin — Farmer Details</h2>
              <p className="page-subtitle">
                Review sales, purchases, and loan requests for this farmer.
              </p>
            </div>

            <div className="actions">
              <Link to="/admin/farmers" className="btn-ghost">
                ← Back
              </Link>
              <button className="btn-primary" onClick={load}>
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: "crimson", marginTop: 10 }}>
              {error}
            </p>
          )}

          <div style={{ display: "grid", gap: 16, marginTop: 14 }}>
            <Card title="Sales">
              {sales.length === 0 ? (
                <p>No sales.</p>
              ) : (
                <div className="list">
                  {sales.map((s) => (
                    <div key={s._id} className="list-item">
                      <div style={{ fontWeight: 900 }}>{s.productType}</div>

                      <div style={{ fontSize: 14, color: "#334155" }}>
                        {s.quantity} × {s.unitPrice} = <b>{s.totalAmount}</b>
                      </div>

                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        {s.date
                          ? String(s.date).slice(0, 10)
                          : s.createdAt
                          ? String(s.createdAt).slice(0, 10)
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Purchases ">
              {purchases.length === 0 ? (
                <p>No purchases.</p>
              ) : (
                <div style={{ display: "grid", gap: 14 }}>
                  {purchasesBySupplier.map(([supplierId, items]) => (
                    <div key={supplierId} className="list-item">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div style={{ fontWeight: 900 }}>
                          Supplier: {supplierId}
                        </div>

                        <span style={{ opacity: 0.75, fontSize: 13 }}>
                          {items.length} transaction{items.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="list" style={{ marginTop: 10 }}>
                        {items.map((p) => (
                          <div
                            key={p._id}
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 12,
                              padding: 12,
                              background: "rgba(255,255,255,0.95)",
                            }}
                          >
                            <div style={{ fontWeight: 900 }}>{p.itemType}</div>

                            <div style={{ fontSize: 14, color: "#334155" }}>
                              {p.quantity} × {p.unitPrice} = <b>{p.totalCost}</b>
                            </div>

                            <div
                              style={{
                                fontSize: 12,
                                opacity: 0.7,
                                marginTop: 4,
                              }}
                            >
                              {p.date
                                ? String(p.date).slice(0, 10)
                                : p.createdAt
                                ? String(p.createdAt).slice(0, 10)
                                : ""}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Loan Requests">
              {loans.length === 0 ? (
                <p>No loan requests.</p>
              ) : (
                <div className="list">
                  {loans.map((l) => (
                    <div key={l._id} className="list-item">
                      <div>
                        Status: <b>{l.status || "pending"}</b>
                      </div>

                      <div style={{ fontSize: 14, color: "#334155" }}>
                        Requested: <b>{l.requestedAmount ?? "-"}</b> &nbsp; | &nbsp;
                        Approved: <b>{l.approvedAmount ?? "-"}</b>
                      </div>

                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        {l.dateRequested
                          ? String(l.dateRequested).slice(0, 10)
                          : l.createdAt
                          ? String(l.createdAt).slice(0, 10)
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}