"use client";

import { useState, useRef, useEffect } from "react";

type LevelOption = {
  value: "unknown" | "pro" | "college" | "hs";
  label: string;
};

const levels: LevelOption[] = [
  { value: "unknown", label: "Choose…" },
  { value: "pro", label: "Pro / Alumni" },
  { value: "college", label: "College" },
  { value: "hs", label: "High School" },
];

export function LevelSelect({
  value,
  onChange,
}: {
  value: "pro" | "college" | "hs" | "alumni" | "unknown";
  onChange: (value: "pro" | "college" | "hs" | "alumni" | "unknown") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedLevel = levels.find((l) => l.value === value) || levels[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (level: LevelOption) => {
    onChange(level.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...inputStyle,
          background: "#2a2a2a",
          borderRadius: 10,
          paddingLeft: "12px",
          paddingRight: "29px",
          width: "100%",
          boxSizing: "border-box",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{selectedLevel.label}</span>
        <span
          style={{
            fontSize: "12px",
            opacity: 0.7,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            marginLeft: "5px",
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: "#2a2a2a",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 10,
            overflow: "hidden",
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {levels.map((level) => {
            const isSelected = level.value === value;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => handleSelect(level)}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  textAlign: "left",
                  background: isSelected
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: 14,
                  outline: "none",
                  borderBottom:
                    level.value !== levels[levels.length - 1].value
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {level.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  color: "inherit",
  outline: "none",
};
