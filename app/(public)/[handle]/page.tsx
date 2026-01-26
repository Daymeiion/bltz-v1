import { notFound } from "next/navigation";
import { Card } from "@/components/shared/Card";

export default function PublicLockerPage({ params }: { params: { handle: string } }) {
  const handle = params.handle;

  // TODO: Replace with real fetch by handle from DB
  // For now, show a generic page. If handle is missing, 404.
  if (!handle) return notFound();

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <Card>
        <div style={{ fontWeight: 900, fontSize: 18 }}>BLTZ Locker</div>
        <div style={{ opacity: 0.7, marginTop: 6 }}>Handle: <span style={{ opacity: 1, fontWeight: 800 }}>{handle}</span></div>
        <div style={{ marginTop: 14, opacity: 0.85, lineHeight: 1.6 }}>
          This is a placeholder public locker page. Next step: render profile header + blocks.
        </div>
      </Card>
    </div>
  );
}
