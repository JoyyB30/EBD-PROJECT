import { useEffect, useState } from "react";
import Card from "../../components/Card";
import {
  createPurchase,
  getPurchasesForFarmer,
  deletePurchase,
  updatePurchase,
} from "../../api/purchases";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    supplierId: "",
    itemType: "",
    quantity: "",
    unitPrice: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    supplierId: "",
    itemType: "",
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
      const data = await getPurchasesForFarmer();
      setPurchases(data || []);
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

      await createPurchase({
        supplierId: form.supplierId.trim(),
        itemType: form.itemType.trim(),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });

      setForm({
        supplierId: "",
        itemType: "",
        quantity: "",
        unitPrice: "",
      });

      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  async function onDelete(id) {
    try {
      setError("");
      await deletePurchase(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  function startEdit(p) {
    setEditingId(p._id);
    setEditForm({
      supplierId: p.supplierId ?? "",
      itemType: p.itemType ?? "",
      quantity: String(p.quantity ?? ""),
      unitPrice: String(p.unitPrice ?? ""),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      supplierId: "",
      itemType: "",
      quantity: "",
      unitPrice: "",
    });
  }

  async function saveEdit(id) {
    try {
      setError("");

      await updatePurchase(id, {
        supplierId: editForm.supplierId.trim(),
        itemType: editForm.itemType.trim(),
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
            <h2 className="page-title">Purchases</h2>
            <p className="page-subtitle">
              Add, edit, and manage purchases
            </p>
          </div>
        </div>

        <Card title="Add Purchase">
          <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
            <input
              name="supplierId"
              placeholder="Supplier ID"
              value={form.supplierId}
              onChange={onChange}
            />

            <input
              name="itemType"
              placeholder="Item type"
              value={form.itemType}
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
              Add Purchase
            </button>
          </form>

          {error && (
            <p style={{ color: "crimson", marginTop: 10 }}>
              {error}
            </p>
          )}
        </Card>

        <div className="list" style={{ marginTop: 16 }}>
          {purchases.length === 0 ? (
            <div className="list-item">
              <strong>No purchases yet.</strong>
              <p>Add your first purchase using the form above.</p>
            </div>
          ) : (
            purchases.map((p) => {
              const isEditing = editingId === p._id;

              return (
                <div className="list-item" key={p._id}>
                  {!isEditing ? (
                    <>
                      <strong>{p.itemType}</strong>

                      <p>
                        Supplier: <b>{p.supplierId || "-"}</b>
                      </p>

                      <p>
                        {p.quantity} × {p.unitPrice} = <b>{p.totalCost}</b>
                      </p>

                      <div className="actions">
                        <button
                          className="btn-ghost"
                          type="button"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn-danger"
                          type="button"
                          onClick={() => onDelete(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>Edit Purchase</strong>

                      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
                        <input
                          name="supplierId"
                          value={editForm.supplierId}
                          onChange={onEditChange}
                          placeholder="Supplier ID"
                        />

                        <input
                          name="itemType"
                          value={editForm.itemType}
                          onChange={onEditChange}
                          placeholder="Item type"
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
                          onClick={() => saveEdit(p._id)}
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