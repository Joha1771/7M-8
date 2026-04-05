import { useEffect, useRef } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { StatCard, StatusBadge } from "../../components/ui";
import {
  Chart,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  LineController,
  BarController,
} from "chart.js";

Chart.register(
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  LineController,
  BarController,
);

// ── Chart defaults ─────────────────────────────────────────────────────────────
const FONT = "'DM Mono', monospace";
Chart.defaults.color = "rgba(255,255,255,0.35)";
Chart.defaults.font.family = FONT;
Chart.defaults.font.size = 10;

function useChart(ref, config, deps) {
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, config);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ── Revenue Line Chart ─────────────────────────────────────────────────────────
function RevenueChart({ orders }) {
  const canvasRef = useRef(null);

  // Build last-7-days buckets
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  // Simulate revenue per day from orders (use order index as proxy since no real date)
  const revenue = days.map((_, i) => {
    const slice = orders.filter((_, oi) => oi % 7 === i);
    return slice.reduce(
      (s, o) => s + (o.status !== "cancelled" ? o.amount : 0),
      0,
    );
  });

  useChart(
    canvasRef,
    {
      type: "line",
      data: {
        labels: days,
        datasets: [
          {
            label: "Revenue",
            data: revenue,
            borderColor: "#fff",
            borderWidth: 1.5,
            pointBackgroundColor: "#fff",
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true,
            backgroundColor: (ctx) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 180);
              gradient.addColorStop(0, "rgba(255,255,255,0.12)");
              gradient.addColorStop(1, "rgba(255,255,255,0)");
              return gradient;
            },
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a1a",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 10,
            callbacks: { label: (c) => ` $${c.parsed.y.toFixed(0)}` },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.04)" },
            border: { display: false },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            border: { display: false },
            ticks: { callback: (v) => `$${v}` },
          },
        },
      },
    },
    [orders.length],
  );

  return <canvas ref={canvasRef} />;
}

// ── Orders Doughnut ────────────────────────────────────────────────────────────
function OrdersDonut({ orders }) {
  const canvasRef = useRef(null);
  const pending = orders.filter((o) => o.status === "pending").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  useChart(
    canvasRef,
    {
      type: "doughnut",
      data: {
        labels: ["Pending", "Delivered", "Cancelled"],
        datasets: [
          {
            data: [pending, delivered, cancelled],
            backgroundColor: [
              "rgba(250,204,21,0.8)",
              "rgba(74,222,128,0.8)",
              "rgba(248,113,113,0.8)",
            ],
            borderColor: "#111",
            borderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 16, boxWidth: 10, boxHeight: 10 },
          },
          tooltip: {
            backgroundColor: "#1a1a1a",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 10,
          },
        },
      },
    },
    [orders.length],
  );

  return <canvas ref={canvasRef} />;
}

// ── Top Products Bar Chart ─────────────────────────────────────────────────────
function TopProductsChart({ products }) {
  const canvasRef = useRef(null);
  const top5 = [...products]
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    .slice(0, 5);

  useChart(
    canvasRef,
    {
      type: "bar",
      data: {
        labels: top5.map((p) => (p.name ?? p.title ?? "—").slice(0, 14)),
        datasets: [
          {
            label: "Price ($)",
            data: top5.map((p) => p.price ?? 0),
            backgroundColor: "rgba(255,255,255,0.08)",
            borderColor: "rgba(255,255,255,0.25)",
            borderWidth: 1,
            borderRadius: 2,
            hoverBackgroundColor: "rgba(255,255,255,0.15)",
          },
          {
            label: "Stock",
            data: top5.map((p) => p.stock ?? 0),
            backgroundColor: "rgba(74,222,128,0.15)",
            borderColor: "rgba(74,222,128,0.4)",
            borderWidth: 1,
            borderRadius: 2,
            hoverBackgroundColor: "rgba(74,222,128,0.25)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { padding: 12, boxWidth: 10, boxHeight: 10 },
          },
          tooltip: {
            backgroundColor: "#1a1a1a",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 10,
          },
        },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: {
            grid: { color: "rgba(255,255,255,0.04)" },
            border: { display: false },
          },
        },
      },
    },
    [products.length],
  );

  return <canvas ref={canvasRef} />;
}

// ── Chart Card wrapper ─────────────────────────────────────────────────────────
function ChartCard({ title, sub, height = 200, children }) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "20px 24px",
        fontFamily: FONT,
      }}
    >
      <p
        style={{
          margin: "0 0 2px",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </p>
      {sub && (
        <p
          style={{
            margin: "0 0 16px",
            color: "rgba(255,255,255,0.3)",
            fontSize: 10,
          }}
        >
          {sub}
        </p>
      )}
      <div style={{ height, position: "relative" }}>{children}</div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export function DashboardPage() {
  const products = useAdminStore((s) => s.products);
  const orders = useAdminStore((s) => s.orders);

  const pending = orders.filter((o) => o.status === "pending").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.amount, 0);

  return (
    <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: "0 0 4px",
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            fontFamily: FONT,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.3)",
            fontSize: 12,
            fontFamily: FONT,
          }}
        >
          Overview of your store performance
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 24,
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

      {/* Charts row 1 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <ChartCard
          title="Revenue — Last 7 Days"
          sub="active orders only"
          height={200}
        >
          <RevenueChart orders={orders} />
        </ChartCard>
        <ChartCard title="Orders by Status" height={200}>
          <OrdersDonut orders={orders} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div style={{ marginBottom: 24 }}>
        <ChartCard
          title="Top 5 Products"
          sub="by price · stock overlay"
          height={180}
        >
          <TopProductsChart products={products} />
        </ChartCard>
      </div>

      {/* Recent Orders table */}
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
              fontFamily: FONT,
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
            fontFamily: FONT,
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
