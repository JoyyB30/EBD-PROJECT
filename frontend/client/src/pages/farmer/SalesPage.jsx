import { useEffect, useState } from "react";
import Card from "../../components/Card";
import {
  createSale,
  getSalesForFarmer,
  deleteSale,
  updateSale,
} from "../../api/sales";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    productType: "",
    quantity: "",
    unitPrice: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    productType: "",
    quantity: "",
    unitPrice: "",
  });

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function onEditChange(e) {
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function load() {
    try {
      setError("");
      const data = await getSalesForFarmer();
      setSales(data || []);
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

      await createSale({
        productType: form.productType.trim(),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });

      setForm({ productType: "", quantity: "", unitPrice: "" });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  async function onDelete(id) {
    try {
      setError("");
      await deleteSale(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  function startEdit(sale) {
    setEditingId(sale._id);
    setEditForm({
      productType: sale.productType ?? "",
      quantity: String(sale.quantity ?? ""),
      unitPrice: String(sale.unitPrice ?? ""),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ productType: "", quantity: "", unitPrice: "" });
  }

  async function saveEdit(id) {
    try {
      setError("");

      await updateSale(id, {
        productType: editForm.productType.trim(),
        quantity: Number(editForm.quantity),
        unitPrice: Number(editForm.unitPrice),
      });

      setEditingId(null);
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
            <h2 className="page-title">Sales</h2>
            <p className="page-subtitle">
              Add, edit, and manage your sales
            </p>
          </div>
        </div>

        <Card title="Add Sale">
          <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
            <input
              name="productType"
              placeholder="Product type"
              value={form.productType}
              onChange={onChange}
              required
            />

            <input
              name="quantity"
              placeholder="Quantity"
              type="number"
              value={form.quantity}
              onChange={onChange}
              required
            />

            <input
              name="unitPrice"
              placeholder="Unit price"
              type="number"
              value={form.unitPrice}
              onChange={onChange}
              required
            />

            <button className="btn-primary" type="submit">
              Add Sale
            </button>
          </form>

          {error && (
            <p style={{ color: "crimson", marginTop: 10 }}>
              {error}
            </p>
          )}
        </Card>

        <div className="list" style={{ marginTop: 16 }}>
          {sales.length === 0 ? (
            <div className="list-item">
              <strong>No sales yet.</strong>
              <p>Add your first sale using the form above.</p>
            </div>
          ) : (
            sales.map((s) => {
              const isEditing = editingId === s._id;

              return (
                <div className="list-item" key={s._id}>
                  {!isEditing ? (
                    <>
                      <strong>{s.productType}</strong>

                      <p>
                        {s.quantity} × {s.unitPrice} = <b>{s.totalAmount}</b>
                      </p>

                      <div className="actions">
                        <button
                          className="btn-ghost"
                          type="button"
                          onClick={() => startEdit(s)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn-danger"
                          type="button"
                          onClick={() => onDelete(s._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>Edit Sale</strong>

                      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
                        <input
                          name="productType"
                          value={editForm.productType}
                          onChange={onEditChange}
                          placeholder="Product type"
                          required
                        />

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <input
                            name="quantity"
                            type="number"
                            value={editForm.quantity}
                            onChange={onEditChange}
                            placeholder="Quantity"
                            required
                            style={{ flex: 1, minWidth: 180 }}
                          />

                          <input
                            name="unitPrice"
                            type="number"
                            value={editForm.unitPrice}
                            onChange={onEditChange}
                            placeholder="Unit price"
                            required
                            style={{ flex: 1, minWidth: 180 }}
                          />
                        </div>
                      </div>

                      <div className="actions">
                        <button
                          className="btn-primary"
                          type="button"
                          onClick={() => saveEdit(s._id)}
                        >
                          Save
                        </button>

                        <button
                          className="btn-ghost"
                          type="button"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}