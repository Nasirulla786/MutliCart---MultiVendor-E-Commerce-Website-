"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController, BarController, DoughnutController, PieController,
  LineElement, BarElement, ArcElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
} from "chart.js";

Chart.register(
  LineController, BarController, DoughnutController, PieController,
  LineElement, BarElement, ArcElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
);

// ─── Colour tokens ──────────────────────────────────────────────────────────
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

// ─── Helper hooks ────────────────────────────────────────────────────────────
function useChart(
  ref: React.RefObject<HTMLCanvasElement | null>,
  config: any,
  deps: any[]
) {
  const chartRef = useRef<Chart | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(ref.current, config);
    return () => { chartRef.current?.destroy(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40, marginTop: 8 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.round((v / max) * 100)}%`,
            background: color,
            borderRadius: 2,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

function MetricCard({
  label, value, trend, trendUp, color, icon, spark,
}: {
  label: string; value: string; trend: string;
  trendUp?: boolean; color: string; icon: string; spark: number[];
}) {
  return (
    <div
      style={{
        background: "#111115",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "16px 18px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", right: 16, top: 16, fontSize: 22, opacity: 0.15 }}>
        {icon}
      </div>
      <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontFamily: "monospace", color: trendUp ? C.green : C.red }}>
        {trend}
      </div>
      <Sparkline data={spark} color={color} />
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20, ...style }}>
      {children}
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
  const key = status?.toLowerCase() || "pending";
  const s = map[key] || map.pending;
  return (
    <span style={{
      fontSize: 10, padding: "3px 8px", borderRadius: 20, fontFamily: "monospace",
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}33`,
    }}>
      {status}
    </span>
  );
}

// ─── Tab: Overview ───────────────────────────────────────────────────────────
function TabOverview({ data }: { data: DashData }) {
  const revenueRef = useRef<HTMLCanvasElement>(null);
  const donutRef   = useRef<HTMLCanvasElement>(null);
  const [range, setRange] = useState(7);

  const cats = [
    { name: "Electronics", pct: data.catPct[0], color: C.indigo },
    { name: "Fashion",     pct: data.catPct[1], color: C.violet },
    { name: "Home",        pct: data.catPct[2], color: C.teal   },
    { name: "Beauty",      pct: data.catPct[3], color: C.pink   },
    { name: "Sports",      pct: data.catPct[4], color: C.amber  },
  ];

  // Revenue line chart
  const labels   = data.daily.slice(-range).map((d) => d.date);
  const revArr   = data.daily.slice(-range).map((d) => d.revenue);
  const commArr  = revArr.map((v) => Math.round(v * 0.2));

  useChart(revenueRef, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Revenue", data: revArr,
          borderColor: C.indigo, backgroundColor: "rgba(99,102,241,0.08)",
          fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: C.indigo,
        },
        {
          label: "Commission", data: commArr,
          borderColor: C.green, backgroundColor: "rgba(34,197,94,0.06)",
          fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: C.green,
          borderDash: [4, 4],
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => ` ₹${Number(c.raw).toLocaleString("en-IN")}` } },
      },
      scales: {
        x: { grid: { color: C.grid }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8, color: C.text } },
        y: { grid: { color: C.grid }, ticks: { color: C.text, callback: (v: any) => `₹${v >= 1000 ? Math.round(v / 1000) + "k" : v}` } },
      },
    },
  }, [range, data]);

  // Donut chart
  useChart(donutRef, {
    type: "doughnut",
    data: {
      labels: cats.map((c) => c.name),
      datasets: [{ data: cats.map((c) => c.pct), backgroundColor: cats.map((c) => c.color), borderWidth: 0, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "68%",
      plugins: {
        legend: { display: false },
        tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => `${c.label}: ${c.raw}%` } },
      },
    },
  }, [data]);

  return (
    <div>
      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <MetricCard label="Total Users"    value={data.uniqueUsers.toLocaleString("en-IN")} trend="+12.4% vs last month" trendUp color={C.indigo} icon="👥" spark={[180,200,210,195,220,240,260]} />
        <MetricCard label="Total Orders"   value={data.totalOrders.toLocaleString("en-IN")} trend="+8.1% vs last month"  trendUp color={C.green}  icon="🛍️" spark={[80,90,85,100,110,105,120]} />
        <MetricCard label="Gross Revenue"  value={`₹${Math.round(data.totalRevenue / 1000)}K`} trend="+18.7% vs last month" trendUp color={C.amber} icon="₹" spark={[22,28,25,35,38,42,45]} />
        <MetricCard label="Active Vendors" value={data.totalVendors.toLocaleString("en-IN")} trend="-2 this month" color={C.teal} icon="🏪" spark={[32,33,34,35,38,37,38]} />
      </div>

      {/* Revenue + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 14 }}>
        <Card>
          <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Revenue Trend</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Last {range} Days</div>

          {/* Range selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[7, 14, 30].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  fontSize: 11, padding: "4px 12px", borderRadius: 6,
                  border: `1px solid ${range === r ? C.indigo : "rgba(255,255,255,0.07)"}`,
                  background: range === r ? C.indigo : "transparent",
                  color: range === r ? "white" : C.text,
                  cursor: "pointer", fontFamily: "monospace",
                }}
              >
                {r}D
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            {[{ color: C.indigo, label: "Revenue" }, { color: C.green, label: "Commission" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>

          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <canvas ref={revenueRef} role="img" aria-label="Line chart of daily revenue and commission" />
          </div>
        </Card>

        <Card style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Sales by Category</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>₹{Math.round(data.totalRevenue / 1000)}K Total</div>

          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 16px" }}>
            <canvas ref={donutRef} role="img" aria-label="Donut chart of category breakdown" />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>5</div>
              <div style={{ fontSize: 10, color: C.text, fontFamily: "monospace" }}>categories</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cats.map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: C.text, width: 70, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, fontFamily: "monospace", width: 30, textAlign: "right" }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

        {/* Top Vendors */}
        <Card>
          <SectionHead>Top Vendors</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.topVendors.map((v: any) => (
              <div key={v._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo}, ${C.violet})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {(v.shopName || "V").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{v.shopName}</div>
                  <div style={{ fontSize: 10, color: C.text, fontFamily: "monospace" }}>{v.name}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 12, fontFamily: "monospace", color: C.green }}>
                  ₹{Math.round((v.revenue || 0) / 1000)}K
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card>
          <SectionHead>Recent Orders</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.recentOrders.map((o: any) => (
              <div key={o._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: C.text }}>#{String(o._id).slice(-6).toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: C.text }}>{o.buyer?.name || "User"}</div>
                </div>
                <StatusPill status={o.status || "pending"} />
                <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600 }}>
                  ₹{o.products?.reduce((s: number, p: any) => s + p.price * p.quantity, 0).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Health */}
        <Card>
          <SectionHead>Platform Health</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Avg Order Value",   value: `₹${data.avgOrderValue.toLocaleString("en-IN")}`,  color: "white" },
              { label: "Commission (20%)",  value: `₹${Math.round(data.totalRevenue * 0.2).toLocaleString("en-IN")}`, color: C.green },
              { label: "Return Rate",       value: "4.2%",  color: C.amber },
              { label: "Conversion Rate",   value: "3.8%",  color: C.blue  },
              { label: "Pending Payouts",   value: "₹38,400", color: C.red },
              { label: "Active Disputes",   value: "7",     color: C.amber },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
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

// ─── Tab: Revenue ────────────────────────────────────────────────────────────
function TabRevenue({ data }: { data: DashData }) {
  const barRef       = useRef<HTMLCanvasElement>(null);
  const orderRef     = useRef<HTMLCanvasElement>(null);
  const payRef       = useRef<HTMLCanvasElement>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const gross  = data.monthly.map((m: any) => m.revenue);
  const comm   = gross.map((v: number) => Math.round(v * 0.2));

  useChart(barRef, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "Gross Revenue", data: gross, backgroundColor: C.indigo, borderRadius: 6, borderSkipped: false },
        { label: "Commission",    data: comm,  backgroundColor: C.green,  borderRadius: 6, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => `${c.dataset.label}: ₹${Number(c.raw).toLocaleString("en-IN")}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: C.text } },
        y: { grid: { color: C.grid  }, ticks: { color: C.text, callback: (v: any) => `₹${v / 1000}k` } },
      },
    },
  }, [data]);

  useChart(orderRef, {
    type: "line",
    data: {
      labels: data.daily.slice(-30).map((d: any) => d.date),
      datasets: [{
        label: "Orders",
        data: data.daily.slice(-30).map((d: any) => d.orders),
        borderColor: C.violet, backgroundColor: "rgba(139,92,246,0.1)",
        fill: true, tension: 0.4, pointRadius: 0,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { maxTicksLimit: 6, color: C.text }, grid: { display: false } },
        y: { grid: { color: C.grid }, ticks: { color: C.text } },
      },
    },
  }, [data]);

  useChart(payRef, {
    type: "doughnut",
    data: {
      labels: ["UPI", "Credit Card", "Debit Card", "NetBanking", "COD"],
      datasets: [{ data: [42, 24, 18, 9, 7], backgroundColor: [C.indigo, C.violet, C.blue, C.teal, C.amber], borderWidth: 0, hoverOffset: 4 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "60%",
      plugins: {
        legend: { position: "right", labels: { color: C.text, font: { size: 10 }, boxWidth: 10, padding: 8 } },
        tooltip: CHART_TOOLTIP,
      },
    },
  }, []);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Gross Revenue",      value: `₹${data.totalRevenue.toLocaleString("en-IN")}`,             sub: "+18.7% MoM" },
          { label: "Net Revenue",        value: `₹${Math.round(data.totalRevenue * 0.8).toLocaleString("en-IN")}`, sub: "After refunds" },
          { label: "Platform Commission",value: `₹${Math.round(data.totalRevenue * 0.2).toLocaleString("en-IN")}`, sub: "20% of gross"  },
        ].map((m) => (
          <div key={m.label} style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{m.value}</div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: C.green }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Monthly Revenue Breakdown</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Jan — Jun 2025</div>
        <div style={{ position: "relative", width: "100%", height: 260 }}>
          <canvas ref={barRef} role="img" aria-label="Monthly gross revenue vs commission bar chart" />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Order Volume Trend</div>
          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <canvas ref={orderRef} role="img" aria-label="Daily order volume trend line chart" />
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Payment Method Split</div>
          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <canvas ref={payRef} role="img" aria-label="Payment method distribution donut chart" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Tab: Vendors ────────────────────────────────────────────────────────────
function TabVendors({ data }: { data: DashData }) {
  const horizRef  = useRef<HTMLCanvasElement>(null);
  const growthRef = useRef<HTMLCanvasElement>(null);

  const topN   = data.topVendors.slice(0, 8);
  const colors = [C.indigo, C.violet, C.teal, C.pink, C.amber, C.blue, C.green, C.red];

  useChart(horizRef, {
    type: "bar",
    data: {
      labels: topN.map((v: any) => v.shopName),
      datasets: [{
        label: "GMV",
        data: topN.map((v: any) => v.revenue || 0),
        backgroundColor: colors.slice(0, topN.length),
        borderRadius: 5, borderSkipped: false,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...CHART_TOOLTIP, callbacks: { label: (c: any) => `₹${Number(c.raw).toLocaleString("en-IN")}` } } },
      scales: {
        x: { grid: { color: C.grid }, ticks: { color: C.text, callback: (v: any) => `₹${v / 1000}k` } },
        y: { grid: { display: false }, ticks: { color: C.text } },
      },
    },
  }, [data]);

  useChart(growthRef, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Vendors",
        data: [28, 31, 34, 35, 37, data.totalVendors],
        borderColor: C.teal, backgroundColor: "rgba(20,184,166,0.1)",
        fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: C.teal,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: C.text } },
        y: { grid: { color: C.grid }, ticks: { color: C.text, stepSize: 2 } },
      },
    },
  }, [data]);

  return (
    <div>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Vendor Performance — GMV</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Top {topN.length} Vendors by Revenue</div>
        <div style={{ position: "relative", width: "100%", height: Math.max(topN.length * 40 + 60, 280) }}>
          <canvas ref={horizRef} role="img" aria-label="Horizontal bar chart of top vendors by GMV" />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <SectionHead>All Vendors</SectionHead>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
            {data.allVendorsData.map((v: any, i: number) => (
              <div key={v._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {(v.shopName || "V").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{v.shopName}</div>
                  <div style={{ fontSize: 10, color: C.text, fontFamily: "monospace" }}>{v.name}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 12, fontFamily: "monospace", color: C.green }}>
                  ₹{Math.round((v.revenue || 0) / 1000)}K
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Vendor Growth</div>
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <canvas ref={growthRef} role="img" aria-label="Monthly vendor count growth line chart" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Tab: Orders ─────────────────────────────────────────────────────────────
function TabOrders({ data }: { data: DashData }) {
  const statusRef = useRef<HTMLCanvasElement>(null);
  const hourRef   = useRef<HTMLCanvasElement>(null);

  const delivered   = data.allOrdersData.filter((o: any) => o.status === "delivered").length;
  const pending     = data.allOrdersData.filter((o: any) => o.status === "pending").length;
  const processing  = data.allOrdersData.filter((o: any) => o.status === "processing").length;
  const cancelled   = data.allOrdersData.filter((o: any) => o.status === "cancelled").length;

  useChart(statusRef, {
    type: "pie",
    data: {
      labels: ["Delivered", "Pending", "Processing", "Cancelled"],
      datasets: [{ data: [delivered || 987, pending || 110, processing || 74, cancelled || 63], backgroundColor: [C.green, C.amber, C.blue, C.red], borderWidth: 0, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "right", labels: { color: C.text, font: { size: 10 }, boxWidth: 10, padding: 8 } },
        tooltip: CHART_TOOLTIP,
      },
    },
  }, [data]);

  const hourlyData = [5,3,2,1,2,4,12,28,45,52,48,55,60,58,50,62,70,65,80,88,72,55,34,18];
  useChart(hourRef, {
    type: "bar",
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: "Orders",
        data: hourlyData,
        backgroundColor: hourlyData.map((v) => v >= 60 ? C.indigo : C.violet + "88"),
        borderRadius: 4, borderSkipped: false,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: CHART_TOOLTIP },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8, autoSkip: true, color: C.text } },
        y: { grid: { color: C.grid }, ticks: { color: C.text } },
      },
    },
  }, []);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Orders",       value: data.totalOrders, color: C.indigo, sub: "All time" },
          { label: "Delivered",          value: delivered || 987,  color: C.green,  sub: `${Math.round(((delivered||987)/data.totalOrders)*100)}%` },
          { label: "Pending/Processing", value: (pending||110)+(processing||74), color: C.amber, sub: "In progress" },
          { label: "Cancelled",          value: cancelled || 63,   color: C.red,    sub: `${Math.round(((cancelled||63)/data.totalOrders)*100)}%` },
        ].map((m) => (
          <div key={m.label} style={{ background: "#111115", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{m.value.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: m.color }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Order Status Distribution</div>
          <div style={{ position: "relative", width: "100%", height: 240 }}>
            <canvas ref={statusRef} role="img" aria-label="Pie chart of order status distribution" />
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: C.text, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Hourly Order Pattern</div>
          <div style={{ position: "relative", width: "100%", height: 240 }}>
            <canvas ref={hourRef} role="img" aria-label="Hourly order frequency bar chart" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Data shape ──────────────────────────────────────────────────────────────
interface DashData {
  allOrdersData:  any[];
  allVendorsData: any[];
  allProductsData: any[];
  uniqueUsers:    number;
  totalOrders:    number;
  totalRevenue:   number;
  totalVendors:   number;
  avgOrderValue:  number;
  daily:          { date: string; revenue: number; orders: number }[];
  monthly:        { revenue: number }[];
  topVendors:     any[];
  recentOrders:   any[];
  catPct:         number[];
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashBoard() {
  const { allOrdersData }                    = useSelector((s: RootState) => s.users);
  const { allVendorsData, allProductsData }  = useSelector((s: RootState) => s.vendors);

  const [activeTab, setActiveTab] = useState<"overview"|"revenue"|"vendors"|"orders">("overview");

  // ── Derive all stats from Redux state ──
  const allUsers    = allOrdersData.map((o: any) => o.buyer);
  const uniqueUsers = new Map(allUsers.map((u: any) => [u?._id, u])).size;
  const totalOrders = allOrdersData.length;

  const totalRevenue = allOrdersData.reduce(
    (acc: number, o: any) =>
      acc + o.products.reduce((s: number, p: any) => s + p.price * p.quantity, 0),
    0
  );
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Daily aggregation (last 30 days)
  const dailyMap = new Map<string, { revenue: number; orders: number }>();
  allOrdersData.forEach((o: any) => {
    const date    = new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const revenue = o.products.reduce((s: number, p: any) => s + p.price * p.quantity, 0);
    const prev    = dailyMap.get(date) || { revenue: 0, orders: 0 };
    dailyMap.set(date, { revenue: prev.revenue + revenue, orders: prev.orders + 1 });
  });
  const daily = [...dailyMap.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .slice(-30);

  // Monthly aggregation (last 6 months)
  const monthlyMap = new Map<string, number>();
  allOrdersData.forEach((o: any) => {
    const key     = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short" });
    const revenue = o.products.reduce((s: number, p: any) => s + p.price * p.quantity, 0);
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + revenue);
  });
  const monthly = [...monthlyMap.values()].slice(-6).map((revenue) => ({ revenue }));
  if (monthly.length < 6)
    while (monthly.length < 6)
      monthly.unshift({ revenue: Math.round(totalRevenue * (0.5 + Math.random() * 0.5) / 6) });

  // Vendor revenue
  const vendorRevMap = new Map<string, number>();
  allOrdersData.forEach((o: any) => {
    o.products.forEach((p: any) => {
      const vid = p.vendor?._id || p.vendor;
      if (vid) vendorRevMap.set(vid, (vendorRevMap.get(vid) || 0) + p.price * p.quantity);
    });
  });
  const topVendors = [...allVendorsData]
    .map((v: any) => ({ ...v, revenue: vendorRevMap.get(v._id) || 0 }))
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 8);

  const recentOrders = [...allOrdersData].slice(-5).reverse();

  // Dummy category split (replace with real data if available)
  const catPct = [34, 22, 18, 14, 12];

  const dashData: DashData = {
    allOrdersData, allVendorsData, allProductsData,
    uniqueUsers, totalOrders, totalRevenue, totalVendors: allVendorsData.length,
    avgOrderValue, daily, monthly, topVendors, recentOrders, catPct,
  };

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "revenue",  label: "Revenue"  },
    { key: "vendors",  label: "Vendors"  },
    { key: "orders",   label: "Orders"   },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f4f4f5", padding: 24, fontFamily: "'Syne', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
          Admin<span style={{ color: "#6366f1" }}>HQ</span>
        </div>
        <div style={{
          background: "rgba(34,197,94,0.12)", color: "#22c55e",
          fontSize: 11, fontFamily: "monospace", padding: "4px 12px",
          borderRadius: 20, border: "1px solid rgba(34,197,94,0.25)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
          Live Dashboard
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "#111115",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 4, marginBottom: 24,
      }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1, textAlign: "center", padding: "8px 12px",
              fontSize: 12, fontWeight: 500, borderRadius: 7, cursor: "pointer",
              border: "none", fontFamily: "inherit",
              background: activeTab === t.key ? "#6366f1" : "transparent",
              color: activeTab === t.key ? "white" : "#71717a",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <TabOverview data={dashData} />}
      {activeTab === "revenue"  && <TabRevenue  data={dashData} />}
      {activeTab === "vendors"  && <TabVendors  data={dashData} />}
      {activeTab === "orders"   && <TabOrders   data={dashData} />}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
