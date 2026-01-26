import { Card } from "@/components/shared/Card";

export default function Loading() {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <Card>
        <div style={{ opacity: 0.7 }}>Loading locker…</div>
      </Card>
    </div>
  );
}
