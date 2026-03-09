import Sparkbar from "./Sparkbar";
import { cardData } from "../../data/dashboardData.jsx";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

const AnalyticsCards = () => (
  <div
    style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}
  >
    {cardData.map((card, idx) => (
      <div
        key={idx}
        className={`fade-up card-${idx} stat-glow`}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "20px 22px",
          border: "1px solid #f1f5f9",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 80,
            height: 80,
            background: `radial-gradient(circle at top right, ${card.color}10, transparent 70%)`,
            borderRadius: "0 16px 0 0",
          }}
        />

        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: card.bg,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              {card.title}
            </span>
          </div>
          <Sparkbar color={card.color} />
        </div>

        {/* Stat tiles */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {card.stats.map((stat, i) => {
            const isNeg = stat.change.startsWith("-");
            return (
              <div
                key={i}
                style={{
                  background: "#fafafa",
                  borderRadius: 10,
                  padding: "10px 12px",
                  border: "1px solid #f1f5f9",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    marginBottom: 4,
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </p>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: "#111827",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: isNeg ? "#ef4444" : "#10b981",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {isNeg ? (
                      <FiTrendingDown size={11} />
                    ) : (
                      <FiTrendingUp size={11} />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: "#d1d5db", marginTop: 3 }}>
                  vs last week
                </p>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export default AnalyticsCards;