export function Logo() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: "linear-gradient(135deg, #ffbb00, #ff7a00)",
          boxShadow: "0 10px 30px rgba(255,187,0,0.18)",
        }}
      />
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>BLTZ</span>
    </div>
  );
}
