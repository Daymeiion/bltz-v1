export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "26px 18px" }}>
      {children}
    </div>
  );
}
