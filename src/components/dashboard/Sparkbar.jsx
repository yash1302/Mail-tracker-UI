const Sparkbar = ({ color }) => {
  const heights = [30, 50, 40, 70, 55, 80, 65, 90];

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: `${h}%`,
            borderRadius: 3,
            background: i === heights.length - 1 ? color : `${color}40`,
          }}
        />
      ))}
    </div>
  );
};

export default Sparkbar;