"use client";

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const base: React.CSSProperties = {
  borderRadius: 8,
  padding: "12px 14px",
  fontWeight: 700,
  letterSpacing: 0.3,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};

export function PrimaryButton(props: BtnProps) {
  const disabled = Boolean(props.disabled);
  const { style, ...restProps } = props;
  return (
    <button
      {...restProps}
      style={{
        ...base,
        background: disabled ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #ffbb00, #ff7a00)",
        color: disabled ? "rgba(231,234,240,0.55)" : "#111",
        border: "none",
        boxShadow: disabled ? "none" : "0 12px 30px rgba(255,187,0,0.14)",
        opacity: disabled ? 0.7 : 1,
        ...style,
      }}
    />
  );
}

export function SecondaryButton(props: BtnProps) {
  const { style, ...restProps } = props;
  return (
    <button
      {...restProps}
      style={{
        ...base,
        background: "rgba(255,255,255,0.04)",
        ...style,
      }}
    />
  );
}
