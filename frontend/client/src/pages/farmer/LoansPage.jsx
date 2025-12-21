import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { createLoan, deleteLoan, getLoansForFarmer } from "../../api/loans";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    requestedAmount: "",
  });

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function load() {
    try {
      setError("");
      const data = await getLoansForFarmer();
      setLoans(data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      const amt = Number(form.requestedAmount);
      if (Number.isNaN(amt) || amt <= 0) {
        setError("Please enter a valid requested amount.");
        return;
      }

      await createLoan({ requestedAmount: amt });

      setForm({ requestedAmount: "" });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  async function onDelete(id) {
    try {
      setError("");
      await deleteLoan(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  return (
    <div className="container">
      <div className="panel">
        <div className="page-header">
          <div>
            <h2 className="page-title">Loan Requests</h2>
            <p className="page-subtitle">
              Request loans and track approvals
            </p>
          </div>
        </div>

        <Card title="Request a Loan">
          <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
            <input
              name="requestedAmount"
              placeholder="Requested Amount"
              type="number"
              value={form.requestedAmount}
              onChange={onChange}
              required
            />

            <button className="btn-primary" type="submit">
              Request Loan
            </button>
          </form>

          {error && (
            <p style={{ color: "crimson", marginTop: 10 }}>
              {error}
            </p>
          )}
        </Card>

        <div className="list" style={{ marginTop: 16 }}>
          {loans.length === 0 ? (
            <div className="list-item">
              <strong>No loan requests yet.</strong>
              <p>Submit a loan request using the form above.</p>
            </div>
          ) : (
            loans.map((l) => (
              <div className="list-item" key={l._id}>
                <strong>
                  Requested: {l.requestedAmount ?? "-"}
                </strong>

                <p>
                  Status: <b>{l.status || "pending"}</b>
                </p>

                <p>
                  Approved: <b>{l.approvedAmount ?? "-"}</b>
                </p>

                <div className="actions">
                  <button
                    className="btn-danger"
                    type="button"
                    onClick={() => onDelete(l._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}