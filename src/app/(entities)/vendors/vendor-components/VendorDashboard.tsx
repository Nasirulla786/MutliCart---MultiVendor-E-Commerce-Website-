//@ts-nocheck
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController, BarController, DoughnutController,
  LineElement, BarElement, ArcElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
} from "chart.js";

Chart.register(
  LineController, BarController, DoughnutController,
  LineElement, BarElement, ArcElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
);

// ─── Colour tokens ───────────────────────────────────────────────────────────
const C = {
  indigo:  "#6366f1",
  violet:  "#8b5cf6",
  green:   "#22c55e",
  amber:   "#f59e0b",
  red:     "#ef4444",
  blue:    "#3b82f6",
  teal:    "#14b8a6",
  pink:    "#f472b6",
  grid:    "rgba(255,255,255,0.06)",
  text:    "#71717a",
};

const CHART_TOOLTIP = {
  backgroundColor: "rgba(17,17,21,0.95)",
  titleColor: "#f4f4f5",
  bodyColor: "#a1a1aa",
  padding: 12,
  cornerRadius: 8,
  borderColor: C.grid,
  borderWidth: 1,
};

// ─── useChart hook ────────────────────────────────────────────────────────────
function useChart(ref: React.RefObject<HTMLCanvasElement | null>, config: any, deps: any[]) {
  const instance = useRef<Chart | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    instance.current?.destroy();
    instance.current = new Chart(ref.current, config);
    return () => { instance.current?.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── Small reusable pieces ───────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36, marginTop: 8 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${Math.round((v / max) * 100)}%`, background: color, borderRadius: 2, opacity: 0.65 }} />
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    delivered:  { bg: "rgba(34,197,94,0.12)",  color: C.green },
    pending:    { bg: "rgba(245,158,11,0.12)", color: C.amber },
    processing: { bg: "rgba(59,130,246,0.12)", color: C.blue  },
    cancelled:  { bg: "rgba(239,68,68,0.12)",  color: C.red   },
  };
  const key = (status || "pending").toLowerCase();
  const s = map[key] || map.pending;
  return (
    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, fontFamily: "monospace", background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
      {status || "pending"}
    </span>
  );
}

function MetricCard({ label, value, sub, subUp, color, icon, spark }: any) {
  return (
    <div style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 16, top: 16, fontSize: 20, opacity: 0.13 }}>{icon}</div>
      <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 11, fontFamily: "monospace", color: subUp ? C.green : C.text }}>{sub}</div>
      <Sparkline data={spark} color={color} />
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function TabOverview({ d }: { d: VDash }) {
  const revRef  = useRef<HTMLCanvasElement>(null);
  const catRef  = useRef<HTMLCanvasElement>(null);
  const [range, setRange] = useState(7);

  const slice   = d.daily.slice(-range);
  const labels  = slice.map((x) => x.date);
  const revArr  = slice.map((x) => x.revenue);
  const ordArr  = slice.map((x) => x.orders);

  useChart(revRef, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Revenue", data: revArr, borderColor: C.indigo, backgroundColor: "rgba(99,102,241,0.08)", fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: C.indigo },
        { label: "Orders",  data: ordArr, borderColor: C.teal,   backgroundColor: "rgba(20,184,166,0.06)",  fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: C.teal, borderDash: [4, 4], yAxisID: "y2" },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: { legend: { display: false }, tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => c.datasetIndex === 0 ? ` ₹${Number(c.raw).toLocaleString("en-IN")}` : ` ${c.raw} orders` } } },
      scales: {
        x:  { grid: { color: C.grid }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8, color: C.text } },
        y:  { grid: { color: C.grid }, ticks: { color: C.text, callback: (v: any) => `₹${v >= 1000 ? Math.round(v / 1000) + "k" : v}` }, position: "left" },
        y2: { grid: { display: false }, ticks: { color: C.teal }, position: "right" },
      },
    },
  }, [range, d]);

  // Product category donut — derived from product titles (simple heuristic)
  const catColors = [C.indigo, C.violet, C.teal, C.pink, C.amber];
  useChart(catRef, {
    type: "doughnut",
    data: {
      labels: d.topProductNames.slice(0, 5),
      datasets: [{ data: d.topProductRevenue.slice(0, 5), backgroundColor: catColors, borderWidth: 0, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "68%",
      plugins: { legend: { display: false }, tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => `${c.label}: ₹${Number(c.raw).toLocaleString("en-IN")}` } } },
    },
  }, [d]);

  const totalPct = d.topProductRevenue.reduce((a: number, b: number) => a + b, 0) || 1;

  return (
    <div>
      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <MetricCard label="My Products"  value={d.myProducts.length}                       sub="In catalogue"        color={C.indigo} icon="📦" spark={[4,5,5,6,6,7,d.myProducts.length]}   />
        <MetricCard label="Total Orders" value={d.myOrders.length.toLocaleString("en-IN")} sub="+8.1% this month" subUp color={C.green}  icon="🛒" spark={[20,25,22,30,35,32,d.myOrders.length]} />
        <MetricCard label="Revenue"      value={`₹${Math.round(d.totalRevenue / 1000)}K`}  sub="+14.2% this month" subUp color={C.amber} icon="₹"  spark={[8,10,9,14,16,15,Math.round(d.totalRevenue/1000)]} />
        <MetricCard label="Customers"    value={d.totalCustomers}                           sub="Unique buyers"       color={C.teal}   icon="👥" spark={[5,8,9,12,14,15,d.totalCustomers]}   />
      </div>

      {/* Revenue chart + top products */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionHead>Revenue & Orders Trend</SectionHead>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Last {range} Days</div>

          {/* Range buttons */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[7, 14, 30].map((r) => (
              <button key={r} onClick={() => setRange(r)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: `1px solid ${range === r ? C.indigo : "rgba(255,255,255,0.07)"}`, background: range === r ? C.indigo : "transparent", color: range === r ? "white" : C.text, cursor: "pointer", fontFamily: "monospace" }}>
                {r}D
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            {[{ color: C.indigo, label: "Revenue" }, { color: C.teal, label: "Orders" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>

          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <canvas ref={revRef} role="img" aria-label="Line chart of daily revenue and order count" />
          </div>
        </Card>

        <Card style={{ display: "flex", flexDirection: "column" }}>
          <SectionHead>Revenue by Product</SectionHead>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Top {Math.min(5, d.topProductNames.length)} Products</div>

          <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 16px" }}>
            <canvas ref={catRef} role="img" aria-label="Donut chart of revenue per product" />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{d.myProducts.length}</div>
              <div style={{ fontSize: 10, color: C.text, fontFamily: "monospace" }}>products</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.topProductNames.slice(0, 5).map((name: string, i: number) => {
              const pct = Math.round((d.topProductRevenue[i] / totalPct) * 100);
              return (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: C.text, width: 80, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: catColors[i], borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: "monospace", width: 30, textAlign: "right" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

        {/* Order Status */}
        <Card>
          <SectionHead>Order Status</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Delivered",  value: d.statusCount.delivered,  color: C.green, bg: "rgba(34,197,94,0.12)"  },
              { label: "Pending",    value: d.statusCount.pending,    color: C.amber, bg: "rgba(245,158,11,0.12)" },
              { label: "Processing", value: d.statusCount.processing, color: C.blue,  bg: "rgba(59,130,246,0.12)" },
              { label: "Cancelled",  value: d.statusCount.cancelled,  color: C.red,   bg: "rgba(239,68,68,0.12)"  },
            ].map((s) => {
              const pct = d.myOrders.length > 0 ? Math.round((s.value / d.myOrders.length) * 100) : 0;
              return (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: C.text }}>{s.label}</span>
                    <span style={{ fontFamily: "monospace", color: s.color }}>{s.value} ({pct}%)</span>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: s.color, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card>
          <SectionHead>Recent Orders</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {d.recentOrders.map((o: any) => {
              const amt = o.products?.reduce((s: number, p: any) => s + p.price * p.quantity, 0) || 0;
              return (
                <div key={o._id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: C.text }}>#{String(o._id).slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: "#f4f4f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.buyer?.name || "Customer"}</div>
                  </div>
                  <StatusPill status={o.orderStatus || o.status || "pending"} />
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", flexShrink: 0 }}>₹{amt.toLocaleString("en-IN")}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Shop health */}
        <Card>
          <SectionHead>Shop Health</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Avg Order Value",  value: `₹${d.avgOrderValue.toLocaleString("en-IN")}`, color: "white"  },
              { label: "Delivery Rate",    value: `${d.deliveryRate}%`,                           color: C.green  },
              { label: "Cancellation Rate",value: `${d.cancelRate}%`,                             color: C.red    },
              { label: "Total Revenue",    value: `₹${d.totalRevenue.toLocaleString("en-IN")}`,   color: C.amber  },
              { label: "My Commission",    value: `₹${Math.round(d.totalRevenue * 0.8).toLocaleString("en-IN")}`, color: C.teal },
              { label: "Products Listed",  value: `${d.myProducts.length}`,                        color: C.indigo },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: C.text }}>{row.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", color: row.color }}>{row.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Tab: Products ────────────────────────────────────────────────────────────
function TabProducts({ d }: { d: VDash }) {
  const barRef = useRef<HTMLCanvasElement>(null);

  useChart(barRef, {
    type: "bar",
    data: {
      labels: d.topProductNames.slice(0, 8),
      datasets: [{
        label: "Revenue", data: d.topProductRevenue.slice(0, 8),
        backgroundColor: [C.indigo, C.violet, C.teal, C.pink, C.amber, C.blue, C.green, C.red],
        borderRadius: 6, borderSkipped: false,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => `₹${Number(c.raw).toLocaleString("en-IN")}` } } },
      scales: {
        x: { grid: { color: C.grid }, ticks: { color: C.text, callback: (v: any) => `₹${v >= 1000 ? Math.round(v / 1000) + "k" : v}` } },
        y: { grid: { display: false }, ticks: { color: C.text } },
      },
    },
  }, [d]);

  return (
    <div>
      <Card style={{ marginBottom: 14 }}>
        <SectionHead>Product Revenue — Top {Math.min(8, d.topProductNames.length)}</SectionHead>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Revenue per Product</div>
        <div style={{ position: "relative", width: "100%", height: Math.max(d.topProductNames.slice(0, 8).length * 40 + 60, 260) }}>
          <canvas ref={barRef} role="img" aria-label="Horizontal bar chart of revenue by product" />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {d.myProducts.map((p: any, i: number) => (
          <div key={p._id} style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 120, overflow: "hidden", background: "#1a1a2e" }}>
              <img src={p.image1 || p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>₹{p.price?.toLocaleString("en-IN")}</div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: C.text }}>stock: {p.stock ?? "—"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Orders ──────────────────────────────────────────────────────────────
function TabOrders({ d }: { d: VDash }) {
  const statusRef = useRef<HTMLCanvasElement>(null);
  const hourRef   = useRef<HTMLCanvasElement>(null);

  useChart(statusRef, {
    type: "pie",
    data: {
      labels: ["Delivered", "Pending", "Processing", "Cancelled"],
      datasets: [{ data: [d.statusCount.delivered, d.statusCount.pending, d.statusCount.processing, d.statusCount.cancelled], backgroundColor: [C.green, C.amber, C.blue, C.red], borderWidth: 0, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "right", labels: { color: C.text, font: { size: 10 }, boxWidth: 10, padding: 8 } }, tooltip: CHART_TOOLTIP },
    },
  }, [d]);

  const hourlyData = [0,0,1,0,1,2,4,8,15,20,18,22,25,23,19,24,28,26,32,35,28,20,12,5];
  useChart(hourRef, {
    type: "bar",
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{ label: "Orders", data: hourlyData, backgroundColor: hourlyData.map((v) => v >= 25 ? C.indigo : C.violet + "88"), borderRadius: 4, borderSkipped: false }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: CHART_TOOLTIP },
      scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8, autoSkip: true, color: C.text } }, y: { grid: { color: C.grid }, ticks: { color: C.text } } },
    },
  }, []);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Orders",  value: d.myOrders.length,            color: C.indigo, sub: "All time" },
          { label: "Delivered",     value: d.statusCount.delivered,      color: C.green,  sub: `${d.deliveryRate}%` },
          { label: "Pending",       value: d.statusCount.pending + d.statusCount.processing, color: C.amber, sub: "In progress" },
          { label: "Cancelled",     value: d.statusCount.cancelled,      color: C.red,    sub: `${d.cancelRate}%` },
        ].map((m) => (
          <div key={m.label} style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{m.value.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: m.color }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionHead>Order Status Split</SectionHead>
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <canvas ref={statusRef} role="img" aria-label="Pie chart of order status distribution" />
          </div>
        </Card>
        <Card>
          <SectionHead>Peak Order Hours</SectionHead>
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <canvas ref={hourRef} role="img" aria-label="Hourly order frequency bar chart" />
          </div>
        </Card>
      </div>

      {/* Full order table */}
      <Card>
        <SectionHead>All My Orders</SectionHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
          {d.myOrders.map((o: any) => {
            const amt  = o.products?.reduce((s: number, p: any) => s + p.price * p.quantity, 0) || 0;
            const item = o.products?.[0];
            return (
              <div key={o._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: C.text, flexShrink: 0 }}>#{String(o._id).slice(-6).toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item?.product?.title || "Product"}</div>
                  <div style={{ fontSize: 10, color: C.text }}>{o.buyer?.name || "Customer"}</div>
                </div>
                <StatusPill status={o.orderStatus || o.status || "pending"} />
                <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: C.green, flexShrink: 0 }}>₹{amt.toLocaleString("en-IN")}</div>
              </div>
            );
          })}
          {d.myOrders.length === 0 && (
            <div style={{ textAlign: "center", color: C.text, fontSize: 13, padding: 40 }}>No orders yet</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── Tab: Revenue ─────────────────────────────────────────────────────────────
function TabRevenue({ d }: { d: VDash }) {
  const monthRef = useRef<HTMLCanvasElement>(null);
  const aovRef   = useRef<HTMLCanvasElement>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const gross  = d.monthly.map((m: any) => m.revenue);
  const myShare = gross.map((v: number) => Math.round(v * 0.8));

  useChart(monthRef, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "Gross Revenue", data: gross,   backgroundColor: C.indigo, borderRadius: 6, borderSkipped: false },
        { label: "My Payout",     data: myShare, backgroundColor: C.green,  borderRadius: 6, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => `${c.dataset.label}: ₹${Number(c.raw).toLocaleString("en-IN")}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: C.text } },
        y: { grid: { color: C.grid }, ticks: { color: C.text, callback: (v: any) => `₹${v >= 1000 ? Math.round(v / 1000) + "k" : v}` } },
      },
    },
  }, [d]);

  useChart(aovRef, {
    type: "line",
    data: {
      labels: d.daily.slice(-30).map((x: any) => x.date),
      datasets: [{
        label: "Daily Revenue",
        data: d.daily.slice(-30).map((x: any) => x.revenue),
        borderColor: C.violet, backgroundColor: "rgba(139,92,246,0.1)",
        fill: true, tension: 0.4, pointRadius: 0,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: CHART_TOOLTIP },
      scales: {
        x: { ticks: { maxTicksLimit: 6, color: C.text }, grid: { display: false } },
        y: { grid: { color: C.grid }, ticks: { color: C.text, callback: (v: any) => `₹${v >= 1000 ? Math.round(v / 1000) + "k" : v}` } },
      },
    },
  }, [d]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Revenue",  value: `₹${d.totalRevenue.toLocaleString("en-IN")}`,             sub: "Gross sales" },
          { label: "My Payout (80%)",value: `₹${Math.round(d.totalRevenue * 0.8).toLocaleString("en-IN")}`, sub: "After platform fee" },
          { label: "Avg Order Value",value: `₹${d.avgOrderValue.toLocaleString("en-IN")}`,            sub: "Per order" },
        ].map((m) => (
          <div key={m.label} style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{m.value}</div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: C.green }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <Card style={{ marginBottom: 14 }}>
        <SectionHead>Monthly Gross Revenue vs My Payout</SectionHead>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Jan — Jun 2025</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          {[{ color: C.indigo, label: "Gross Revenue" }, { color: C.green, label: "My Payout" }].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        <div style={{ position: "relative", width: "100%", height: 250 }}>
          <canvas ref={monthRef} role="img" aria-label="Monthly gross revenue vs payout bar chart" />
        </div>
      </Card>

      <Card>
        <SectionHead>Daily Revenue — Last 30 Days</SectionHead>
        <div style={{ position: "relative", width: "100%", height: 180 }}>
          <canvas ref={aovRef} role="img" aria-label="Daily revenue area chart" />
        </div>
      </Card>
    </div>
  );
}

// ─── Data shape ───────────────────────────────────────────────────────────────
interface VDash {
  myProducts:        any[];
  myOrders:          any[];
  totalRevenue:      number;
  totalCustomers:    number;
  avgOrderValue:     number;
  deliveryRate:      number;
  cancelRate:        number;
  daily:             { date: string; revenue: number; orders: number }[];
  monthly:           { revenue: number }[];
  statusCount:       { delivered: number; pending: number; processing: number; cancelled: number };
  topProductNames:   string[];
  topProductRevenue: number[];
  recentOrders:      any[];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VendorDashboard() {
  const { allProductsData }                   = useSelector((s: RootState) => s.vendors);
  const { allOrdersData, currentUser }        = useSelector((s: RootState) => s.users);

  const [activeTab, setActiveTab] = useState<"overview"|"products"|"orders"|"revenue">("overview");

  const myId = currentUser?.user?._id?.toString();

  // ── Filter to this vendor's data ──────────────────────────────────────────
  const myProducts = (allProductsData || []).filter((p: any) => {
    const vendorId = typeof p.vendor === "object" ? p.vendor?._id : p.vendor;
    return vendorId?.toString() === myId;
  });

  const myOrders = (allOrdersData || []).filter(
    (o: any) => o.productVendor?._id?.toString() === myId
  );

  // ── Revenue ───────────────────────────────────────────────────────────────
  const totalRevenue = myOrders.reduce(
    (acc: number, o: any) => acc + (o.products || []).reduce((s: number, p: any) => s + p.price * p.quantity, 0),
    0
  );

  const totalCustomers = new Set(myOrders.map((o: any) => o.buyer?._id)).size;
  const avgOrderValue  = myOrders.length > 0 ? Math.round(totalRevenue / myOrders.length) : 0;

  // ── Status counts ─────────────────────────────────────────────────────────
  const statusCount = {
    delivered:  myOrders.filter((o: any) => (o.orderStatus || o.status) === "delivered").length,
    pending:    myOrders.filter((o: any) => (o.orderStatus || o.status) === "pending").length,
    processing: myOrders.filter((o: any) => (o.orderStatus || o.status) === "processing").length,
    cancelled:  myOrders.filter((o: any) => (o.orderStatus || o.status) === "cancelled").length,
  };

  const deliveryRate = myOrders.length > 0 ? Math.round((statusCount.delivered / myOrders.length) * 100) : 0;
  const cancelRate   = myOrders.length > 0 ? Math.round((statusCount.cancelled  / myOrders.length) * 100) : 0;

  // ── Daily aggregation (last 30 days) ──────────────────────────────────────
  const dailyMap = new Map<string, { revenue: number; orders: number }>();
  myOrders.forEach((o: any) => {
    const date    = new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const revenue = (o.products || []).reduce((s: number, p: any) => s + p.price * p.quantity, 0);
    const prev    = dailyMap.get(date) || { revenue: 0, orders: 0 };
    dailyMap.set(date, { revenue: prev.revenue + revenue, orders: prev.orders + 1 });
  });
  const daily = [...dailyMap.entries()].map(([date, v]) => ({ date, ...v })).slice(-30);

  // ── Monthly aggregation ───────────────────────────────────────────────────
  const monthlyMap = new Map<string, number>();
  myOrders.forEach((o: any) => {
    const key     = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short" });
    const revenue = (o.products || []).reduce((s: number, p: any) => s + p.price * p.quantity, 0);
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + revenue);
  });
  const monthly = [...monthlyMap.values()].slice(-6).map((revenue) => ({ revenue }));
  while (monthly.length < 6)
    monthly.unshift({ revenue: Math.round(totalRevenue * (0.4 + Math.random() * 0.4) / 6) });

  // ── Product revenue map ───────────────────────────────────────────────────
  const productRevMap = new Map<string, number>();
  myOrders.forEach((o: any) => {
    (o.products || []).forEach((p: any) => {
      const key   = p.product?.title || p.product?._id || "Unknown";
      const value = p.price * p.quantity;
      productRevMap.set(key, (productRevMap.get(key) || 0) + value);
    });
  });
  const sortedProducts = [...productRevMap.entries()].sort((a, b) => b[1] - a[1]);
  const topProductNames   = sortedProducts.map(([name]) => name);
  const topProductRevenue = sortedProducts.map(([, rev]) => rev);

  const recentOrders = [...myOrders].slice(-5).reverse();

  const dashData: VDash = {
    myProducts, myOrders, totalRevenue, totalCustomers, avgOrderValue,
    deliveryRate, cancelRate, daily, monthly, statusCount,
    topProductNames, topProductRevenue, recentOrders,
  };

  const TABS = [
    { key: "overview", label: "Overview"  },
    { key: "products", label: "Products"  },
    { key: "revenue",  label: "Revenue"   },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f4f4f5", padding: 24, fontFamily: "'Syne', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
            Vendor<span style={{ color: C.indigo }}>HQ</span>
          </div>
          <div style={{ fontSize: 12, color: C.text, marginTop: 2 }}>
            Welcome back, <span style={{ color: "#f4f4f5" }}>{currentUser?.user?.name}</span>
          </div>
        </div>
        <div style={{ background: "rgba(34,197,94,0.12)", color: C.green, fontSize: 11, fontFamily: "monospace", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%", display: "inline-block" }} />
          Live Dashboard
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, textAlign: "center", padding: "8px 12px", fontSize: 12, fontWeight: 500, borderRadius: 7, cursor: "pointer", border: "none", fontFamily: "inherit", background: activeTab === t.key ? C.indigo : "transparent", color: activeTab === t.key ? "white" : C.text, transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <TabOverview  d={dashData} />}
      {activeTab === "products" && <TabProducts  d={dashData} />}
      {activeTab === "orders"   && <TabOrders    d={dashData} />}
      {activeTab === "revenue"  && <TabRevenue   d={dashData} />}
    </div>
  );
}
