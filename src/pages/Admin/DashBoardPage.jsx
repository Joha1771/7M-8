import { StatCard, StatusBadge } from "../../components/ui";

export function DashboardPage({ products, orders }) {
  const pending = orders.filter((o) => o.status === "pending").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
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
          Dashboard
        </h1>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.3)",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Overview of your store performance
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 32,
        }}
      >
        <StatCard
          label="Total Products"
          value={products.length}
          sub={`across ${[...new Set(products.map((p) => p.category))].length} categories`}
        />
        <StatCard
          label="Total Orders"
          value={orders.length}
          sub={`${pending} pending`}
          accent="#fff"
        />
        <StatCard
          label="Delivered"
          value={delivered}
          sub="successfully completed"
          accent="#4ade80"
        />
        <StatCard
          label="Revenue"
          value={`$${revenue.toFixed(0)}`}
          sub="excl. cancelled"
          accent="#fff"
        />
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "#111",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.05em",
            }}
          >
            Recent Orders
          </p>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Order ID", "Customer", "Product", "Amount", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 20px",
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
            {orders.slice(0, 5).map((order) => (
              <tr
                key={order.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td
                  style={{
                    padding: "11px 20px",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                  }}
                >
                  {order.id}
                </td>
                <td
                  style={{ padding: "11px 20px", color: "#fff", fontSize: 12 }}
                >
                  {order.customer}
                </td>
                <td
                  style={{
                    padding: "11px 20px",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 11,
                  }}
                >
                  {order.product}
                </td>
                <td
                  style={{
                    padding: "11px 20px",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ${order.amount}
                </td>
                <td style={{ padding: "11px 20px" }}>
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
