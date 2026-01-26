import Link from "next/link";
import Image from "next/image";
import { PrimaryButton } from "@/components/shared/Buttons";

export default function WelcomePage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 200px)",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: 34, margin: "40px 0 20px", fontFamily: "var(--font-urban-shadow)", letterSpacing: "0.05em" }}>Build your digital locker</h1>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Legacy. NIL. Recruiting. One link that represents your football journey.
        </p>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Image
          src="/images/iPhone-11.png"
          alt="Welcome phone preview"
          width={300}
          height={800}
          style={{
            maxWidth: "100%",
            height: "auto",
            objectFit: "contain",
          }}
          priority
        />
        
        <div 
          style={{ 
            display: "flex",
            justifyContent: "center",
            marginLeft: "30px",
            marginRight: "30px"
          }}
        >
          <Link href="/onboarding/path" style={{ display: "block", width: "100%", maxWidth: 500 }}>
            <PrimaryButton style={{ width: "100%", padding: "18px 54px", fontSize: 16, fontWeight: 600, textTransform: "uppercase" }}>Get started</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
