import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { getMonthlySummaryForFarmer } from "../../api/summary";

export default function SummaryPage() {
  const [summary, setSummary] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const data = await getMonthlySummaryForFarmer();
        setSummary(data || {});
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      }
    })();
  }, []);

  const rows = Object.entries(summary)
    .map(([month, v]) => ({
      month,
      income: v.income || 0,
      expense: v.expense || 0,
    }))
    .sort((a, b) => (a.month > b.month ? 1 : -1));

  return (
    <div className="container">
      <div className="panel">
        <div className="page-header">
          <div>
            <h2 className="page-title">Monthly Summary</h2>
            <p className="page-subtitle">
              Income, expenses, and net per month
            </p>
          </div>
        </div>

        <Card title="Summary Table">
          {error && <p style={{ color: "crimson" }}>{error}</p>}

          {rows.length === 0 ? (
            <p>No summary yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 520,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Month
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Income
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Expense
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Net
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr key={r.month}>
                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        {r.month}
                      </td>
                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        {r.income}
                      </td>
                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        {r.expense}
                      </td>
                      <td
                        style={{
                          padding: 10,
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        {r.income - r.expense}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}