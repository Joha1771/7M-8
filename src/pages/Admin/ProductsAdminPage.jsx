import { useState } from "react";
import axiosInstance from "../../Config/axios";
import { Icon } from "../../components/icons";
import { Modal, Field, inputStyle } from "../../components/ui";

export function ProductsAdminPage({ products, loading, onRefresh }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "create" | {product}
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setForm({ name: "", category: "", price: "", stock: "", description: "" });
    setImageFile(null);
    setImagePreview("");
    setModal("create");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name ?? p.title ?? "",
      category: p.category ?? "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      description: p.description ?? "",
    });
    setImageFile(null);
    setImagePreview(p.image ?? "");
    setModal(p);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);

      if (modal === "create") {
        await axiosInstance.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.put(`/products/${modal.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      await onRefresh();
      setModal(null);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/products/${deleteId}`);
      await onRefresh();
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <style>{`.admin-input:focus { border-color: rgba(255,255,255,0.35) !important; }`}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 4px",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Products
          </h1>
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.3)",
              fontSize: 12,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {products.length} items in catalog
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#fff",
            color: "#000",
            border: "none",
            padding: "9px 16px",
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <Icon.plus /> New Product
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          <Icon.search />
        </span>
        <input
          className="admin-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            paddingLeft: 36,
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "#111",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.1)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                marginRight: 10,
                verticalAlign: "middle",
              }}
            />
            Loading products...
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Product", "Category", "Price", "Stock", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
                        textAlign: "left",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    transition: "background 0.1s",
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{
                            width: 36,
                            height: 36,
                            objectFit: "contain",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: 4,
                            padding: 2,
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 18 }}>👟</span>
                      )}
                      <span
                        style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}
                      >
                        {p.name ?? p.title}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 11,
                    }}
                  >
                    {p.category}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    ${p.price}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        color: p.stock < 20 ? "#f87171" : "#4ade80",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {p.stock ?? "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 10px",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.7)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: 10,
                        }}
                      >
                        <Icon.edit /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 10px",
                          background: "rgba(255,80,80,0.07)",
                          border: "1px solid rgba(255,80,80,0.2)",
                          color: "#f87171",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: 10,
                        }}
                      >
                        <Icon.trash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "rgba(255,255,255,0.2)",
                      fontSize: 12,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal !== null && (
        <Modal
          title={modal === "create" ? "New Product" : "Edit Product"}
          onClose={() => setModal(null)}
        >
          <Field label="Image">
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed rgba(255,255,255,0.15)",
                cursor: "pointer",
                background: "rgba(255,255,255,0.02)",
                position: "relative",
                height: imagePreview ? "auto" : 100,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")
              }
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                }}
              />
              {imagePreview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      width: "100%",
                      maxHeight: 160,
                      objectFit: "contain",
                      display: "block",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: "#fff",
                      letterSpacing: "0.1em",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    CHANGE IMAGE
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: "0.1em",
                    }}
                  >
                    CLICK TO UPLOAD
                  </span>
                </div>
              )}
            </label>
            {imageFile && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {imageFile.name}
              </p>
            )}
          </Field>

          <Field label="Name">
            <input
              className="admin-input"
              style={inputStyle}
              placeholder="Nike Air Max..."
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </Field>
          <Field label="Category">
            <input
              className="admin-input"
              style={inputStyle}
              placeholder="Running, Lifestyle..."
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className="admin-input"
              style={{ ...inputStyle, resize: "vertical", minHeight: 64 }}
              placeholder="Product description..."
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </Field>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Price ($)">
              <input
                className="admin-input"
                style={inputStyle}
                type="number"
                placeholder="99.99"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
              />
            </Field>
            <Field label="Stock">
              <input
                className="admin-input"
                style={inputStyle}
                type="number"
                placeholder="50"
                value={form.stock}
                onChange={(e) =>
                  setForm((p) => ({ ...p, stock: e.target.value }))
                }
              />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button
              onClick={() => setModal(null)}
              style={{
                flex: 1,
                padding: "10px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 11,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 2,
                padding: "10px",
                background: saving ? "rgba(255,255,255,0.5)" : "#fff",
                border: "none",
                color: "#000",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {saving && (
                <span
                  style={{
                    width: 10,
                    height: 10,
                    border: "2px solid rgba(0,0,0,0.2)",
                    borderTopColor: "#000",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              )}
              {modal === "create" ? "CREATE PRODUCT" : "SAVE CHANGES"}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Product" onClose={() => setDeleteId(null)}>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              margin: "0 0 20px",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setDeleteId(null)}
              style={{
                flex: 1,
                padding: "10px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 11,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                flex: 1,
                padding: "10px",
                background: "rgba(248,113,113,0.15)",
                border: "1px solid rgba(248,113,113,0.3)",
                color: "#f87171",
                cursor: deleting ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {deleting && (
                <span
                  style={{
                    width: 10,
                    height: 10,
                    border: "2px solid rgba(248,113,113,0.2)",
                    borderTopColor: "#f87171",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              )}
              DELETE
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
