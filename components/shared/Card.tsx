export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}
