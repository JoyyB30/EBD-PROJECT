import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/Card";
import { getSalesByFarmerId } from "../../api/sales";
import { getPurchasesByFarmerId } from "../../api/purchases";

export default function BankFarmerDetailsPage() {
  const { farmerId } = useParams();

  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");

      const [s, p] = await Promise.all([
        getSalesByFarmerId(farmerId),
        getPurchasesByFarmerId(farmerId),
      ]);

      setSales(s || []);
      setPurchases(p || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  useEffect(() => {
    load();
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
    <div className="container">
      <div className="panel">
        <div className="page-header">
          <div>
            <h2 className="page-title">Farmer Details</h2>
            <p className="page-subtitle">Review sales and purchases for this farmer</p>
          </div>

          <div className="actions">
            <Link to="/bank/farmers" className="btn-ghost">
              ← Back
            </Link>
            <button className="btn-primary" onClick={load}>
              Refresh
            </button>
          </div>
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <div style={{ display: "grid", gap: 14 }}>
          <Card title="Sales">
            {sales.length === 0 ? (
              <p>No sales.</p>
            ) : (
              <div className="list">
                {sales.map((s) => (
                  <div className="list-item" key={s._id}>
                    <strong>{s.productType}</strong>
                    <p>
                      {s.quantity} × {s.unitPrice} = <b>{s.totalAmount}</b>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Purchases">
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
                      <strong>Supplier: {supplierId}</strong>

                      <span style={{ opacity: 0.75, fontSize: 13 }}>
                        {items.length} transaction
                        {items.length > 1 ? "s" : ""}
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
                          <strong>{p.itemType}</strong>
                          <p>
                            {p.quantity} × {p.unitPrice} = <b>{p.totalCost}</b>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}