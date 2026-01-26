import { Logo } from "@/components/shared/Logo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <span style={{ fontSize: 13, opacity: 0.7 }}>App</span>
        </div>
      </header>
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "22px 20px" }}>{children}</main>
    </div>
  );
}
