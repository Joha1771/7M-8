import { useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { Icon } from "../../components/icons";
import { StatusBadge, inputStyle } from "../../components/ui";

export function OrdersPage() {
  const orders = useAdminStore((s) => s.orders);
  const loadingOrders = useAdminStore((s) => s.loadingOrders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).toLowerCase().includes(search.toLowerCase()) ||
      o.product?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const handleUpdateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdating(null);
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
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
          Orders
        </h1>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.3)",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {orders.length} total orders
        </p>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: "6px 14px",
              background:
                filter === tab.id ? "rgba(255,255,255,0.1)" : "transparent",
              border:
                filter === tab.id
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "1px solid transparent",
              color: filter === tab.id ? "#fff" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.05em",
            }}
          >
            {tab.label}
            <span
              style={{
                marginLeft: 6,
                color: "rgba(255,255,255,0.25)",
                fontSize: 10,
              }}
            >
              {tab.id === "all"
                ? orders.length
                : orders.filter((o) => o.status === tab.id).length}
            </span>
          </button>
        ))}

        <div style={{ marginLeft: "auto", position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <Icon.search />
          </span>
          <input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 32, width: 220 }}
          />
        </div>
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "#111",
        }}
      >
        {loadingOrders ? (
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
            Loading orders...
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
                {[
                  "Order",
                  "Customer",
                  "Product",
                  "Amount",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 14px",
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
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 11,
                    }}
                  >
                    {order.id}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <p style={{ margin: 0, color: "#fff", fontSize: 12 }}>
                      {order.customer}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.3)",
                        fontSize: 10,
                      }}
                    >
                      {order.email}
                    </p>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11,
                      maxWidth: 140,
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.product}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    ${order.amount}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 10,
                    }}
                  >
                    {order.date}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <StatusBadge status={order.status} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(order.id, "delivered")
                            }
                            disabled={updating === order.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 9px",
                              background: "rgba(74,222,128,0.08)",
                              border: "1px solid rgba(74,222,128,0.2)",
                              color: "#4ade80",
                              cursor:
                                updating === order.id
                                  ? "not-allowed"
                                  : "pointer",
                              fontFamily: "inherit",
                              fontSize: 10,
                              opacity: updating === order.id ? 0.6 : 1,
                            }}
                          >
                            {updating === order.id ? (
                              <span
                                style={{
                                  width: 10,
                                  height: 10,
                                  border: "2px solid rgba(74,222,128,0.2)",
                                  borderTopColor: "#4ade80",
                                  borderRadius: "50%",
                                  display: "inline-block",
                                  animation: "spin 0.7s linear infinite",
                                }}
                              />
                            ) : (
                              <Icon.check />
                            )}
                            Delivered
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(order.id, "cancelled")
                            }
                            disabled={updating === order.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 9px",
                              background: "rgba(248,113,113,0.07)",
                              border: "1px solid rgba(248,113,113,0.2)",
                              color: "#f87171",
                              cursor:
                                updating === order.id
                                  ? "not-allowed"
                                  : "pointer",
                              fontFamily: "inherit",
                              fontSize: 10,
                              opacity: updating === order.id ? 0.6 : 1,
                            }}
                          >
                            {updating === order.id ? (
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
                            ) : (
                              <Icon.x />
                            )}
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status !== "pending" && (
                        <span
                          style={{
                            color: "rgba(255,255,255,0.2)",
                            fontSize: 10,
                            padding: "5px 0",
                          }}
                        >
                          —
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "rgba(255,255,255,0.2)",
                      fontSize: 12,
                    }}
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
