export function ProgressBar({ step, totalSteps = 5 }: { step: number; totalSteps?: number }) {
  const percentage = (step / totalSteps) * 100;

  return (
    <div style={{ width: "100%", padding: "0 20px", marginBottom: 20 }}>
      <div
        style={{
          width: "100%",
          height: 4,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "linear-gradient(135deg, #ffbb00, #ff7a00)",
            borderRadius: 2,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
