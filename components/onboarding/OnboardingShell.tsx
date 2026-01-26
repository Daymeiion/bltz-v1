import Image from "next/image";
import { PageContainer } from "@/components/shared/PageContainer";

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/abstract-textured-backgound.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <header
        style={{
          padding: "18px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          background: "rgba(11,15,23,0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image
            src="/logos/bltz-white-logo-sm.png"
            alt="BLTZ Logo"
            width={120}
            height={40}
            style={{
              height: "auto",
              objectFit: "contain",
            }}
            priority
          />
        </div>
      </header>

      <PageContainer>{children}</PageContainer>

      <footer style={{ padding: "26px 20px", opacity: 0.55, textAlign: "center", fontSize: 12 }}>
        © {new Date().getFullYear()} BLTZ
      </footer>
    </div>
  );
}
