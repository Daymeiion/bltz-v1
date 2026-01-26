import { Logo } from "@/components/shared/Logo";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Logo />
          <span style={{ opacity: 0.7, fontSize: 14 }}>Digital Locker</span>
        </div>
      </header>
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "22px 20px" }}>{children}</main>
    </div>
  );
}
