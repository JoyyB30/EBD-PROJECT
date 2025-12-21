import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { getBankLoans, updateLoan } from "../../api/bank";

export default function BankLoansPage() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");
  const [approvedInputs, setApprovedInputs] = useState({});

  async function load() {
    try {
      setError("");
      const data = await getBankLoans();
      setLoans(data || []);

      const map = {};
      (data || []).forEach((l) => {
        map[l._id] = l.approvedAmount ?? "";
      });
      setApprovedInputs(map);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function isAnswered(status) {
    return status === "approved" || status === "rejected";
  }

  const pendingLoans = loans.filter((l) => !isAnswered(l.status));
  const answeredLoans = loans.filter((l) => isAnswered(l.status));

  async function approveLoan(loanId) {
    try {
      setError("");
      const amount = Number(approvedInputs[loanId]);

      if (Number.isNaN(amount) || amount <= 0) {
        setError("Enter a valid approved amount before approving.");
        return;
      }

      await updateLoan(loanId, { status: "approved", approvedAmount: amount });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  async function rejectLoan(loanId) {
    try {
      setError("");
      await updateLoan(loanId, { status: "rejected" });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  function LoanTable({ title, items, showControls }) {
    return (
      <Card title={title}>
        {items.length === 0 ? (
          <p style={{ margin: 0 }}>No items.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Phone</th>
                  <th>National ID</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Date</th>
                  <th>Approved</th>
                  {showControls && <th />}
                </tr>
              </thead>

              <tbody>
                {items.map((l) => {
                  const farmer = l.farmerId || {};

                  return (
                    <tr key={l._id}>
                      <td>{farmer.username || "-"}</td>
                      <td>{farmer.phone || "-"}</td>
                      <td>{farmer.nationalID || "-"}</td>
                      <td>{l.status || "pending"}</td>
                      <td>{l.requestedAmount ?? "-"}</td>
                      <td>
                        {l.dateRequested
                          ? String(l.dateRequested).slice(0, 10)
                          : l.createdAt
                          ? String(l.createdAt).slice(0, 10)
                          : "-"}
                      </td>

                      <td>
                        {showControls ? (
                          <input
                            type="number"
                            placeholder="Amount"
                            value={approvedInputs[l._id] ?? ""}
                            onChange={(e) =>
                              setApprovedInputs((p) => ({
                                ...p,
                                [l._id]: e.target.value,
                              }))
                            }
                            style={{ width: 130 }}
                          />
                        ) : (
                          <span>{l.approvedAmount ?? "-"}</span>
                        )}
                      </td>

                      {showControls && (
                        <td>
                          <div className="actions">
                            <button
                              className="btn-primary"
                              onClick={() => approveLoan(l._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => rejectLoan(l._id)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="actions" style={{ marginTop: 12 }}>
          <button className="btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="container">
      <div className="panel">
        <div className="page-header">
          <div>
            <h2 className="page-title">Loan Requests</h2>
            <p className="page-subtitle">
              Approve or reject farmer loan requests
            </p>
          </div>
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <div style={{ display: "grid", gap: 14 }}>
          <LoanTable title="Pending Requests" items={pendingLoans} showControls />
          <LoanTable
            title="Answered Requests"
            items={answeredLoans}
            showControls={false}
          />
        </div>
      </div>
    </div>
  );
}