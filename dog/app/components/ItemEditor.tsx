"use client";

import { useState } from "react";

interface ItemEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
}

export default function ItemEditor({ items, onChange }: ItemEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const next = [...items];
    next[editingIndex] = trimmed;
    onChange(next);
    setEditingIndex(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const resetDefaults = () => {
    onChange(Array.from({ length: 12 }, (_, i) => String(i + 1)));
    setEditingIndex(null);
  };

  const SEGMENT_COLORS = [
    "#C94C4C", "#D97A4F", "#E0A84E", "#CDBB5A",
    "#8FA864", "#4F8A6C", "#5A8FA8", "#3E5E85",
    "#6E4F8C", "#9A5B8A", "#A8615E", "#8C6A4A",
  ];

  return (
    <div className="w-full max-w-sm">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "rgba(255,248,236,0.85)",
          border: "1px solid rgba(154,46,46,0.3)",
          color: "#3E2B1F",
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 6px 18px rgba(120,70,40,0.15), inset 0 2px 4px rgba(255,255,255,0.5)",
        }}
      >
        <span className="flex items-center gap-2">
          <span style={{ color: "#C94C4C" }}>✎</span>
          항목 편집
        </span>
        <span
          className="transition-transform duration-300"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "#9A2E2E",
          }}
        >
          ▼
        </span>
      </button>

      {/* Editor panel */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "700px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div
          className="mt-3 rounded-2xl p-5"
          style={{
            background: "rgba(255,248,236,0.92)",
            border: "1px solid rgba(154,46,46,0.25)",
            backdropFilter: "blur(8px)",
            boxShadow:
              "0 10px 30px rgba(120,70,40,0.2), inset 0 2px 4px rgba(255,255,255,0.5)",
          }}
        >
          <p
            className="text-[11px] mb-4 text-center tracking-[0.35em] font-semibold"
            style={{
              color: "#9A2E2E",
              fontFamily: '"Noto Serif KR", "Nanum Myeongjo", serif',
            }}
          >
            ◆ 항목을 클릭하여 수정 ◆
          </p>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item, i) => (
              <div key={i}>
                {editingIndex === i ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      type="text"
                      value={editValue}
                      maxLength={12}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="flex-1 min-w-0 px-2.5 py-2 rounded-xl text-sm font-semibold outline-none"
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        border: `2px solid ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`,
                        color: "#5C4566",
                      }}
                    />
                    <button
                      onClick={commitEdit}
                      className="px-2 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{
                        background: "#B5EAD7",
                        color: "#3A5C4A",
                        border: "1px solid rgba(255,255,255,0.8)",
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{
                        background: "#FFC5C5",
                        color: "#8A3A3A",
                        border: "1px solid rgba(255,255,255,0.8)",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(i)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-[1.04] hover:-translate-y-0.5 active:scale-95 group"
                    style={{
                      background: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                      border: `1px solid rgba(250,242,227,0.9)`,
                      color: "#FAF2E3",
                      boxShadow:
                        "0 2px 6px rgba(80,40,20,0.2), inset 0 1px 2px rgba(255,255,255,0.25)",
                      textShadow: "0 1px 2px rgba(40,20,10,0.35)",
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                      style={{
                        background: "rgba(250,242,227,0.95)",
                        color: "#3E2B1F",
                        boxShadow: "inset 0 1px 2px rgba(100,60,30,0.2)",
                        textShadow: "none",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-left truncate">{item}</span>
                    <span
                      className="text-xs opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#FAF2E3" }}
                    >
                      ✎
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={resetDefaults}
            className="mt-4 w-full py-2.5 rounded-xl text-xs tracking-[0.2em] transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(245,230,210,0.7)",
              color: "#6B4A2E",
              border: "1px solid rgba(154,46,46,0.25)",
            }}
          >
            ↺ 기본값으로 초기화 (1~12)
          </button>
        </div>
      </div>
    </div>
  );
}
