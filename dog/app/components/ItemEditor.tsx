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
    "#FFB5C2", "#FFCFA8", "#FFE5A8", "#F5F0B0",
    "#D6F0B5", "#B5EAD7", "#B5DCE8", "#C4C9F0",
    "#D5BFEA", "#EAC0E0", "#F5C7C0", "#F0D9B5",
  ];

  return (
    <div className="w-full max-w-sm">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "rgba(255,255,255,0.65)",
          border: "1px solid rgba(255,255,255,0.9)",
          color: "#6B4A7A",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 6px 18px rgba(200,170,220,0.18), inset 0 2px 4px rgba(255,255,255,0.6)",
        }}
      >
        <span className="flex items-center gap-2">
          <span style={{ color: "#E8A5C5" }}>✎</span>
          항목 편집
        </span>
        <span
          className="transition-transform duration-300"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "#B77A9C",
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
          className="mt-3 rounded-3xl p-5"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 10px 30px rgba(200,170,220,0.2), inset 0 2px 4px rgba(255,255,255,0.6)",
          }}
        >
          <p
            className="text-[11px] mb-4 text-center tracking-[0.25em] uppercase font-semibold"
            style={{ color: "#B77A9C" }}
          >
            항목을 클릭하여 수정
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
                      background: `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}88`,
                      border: `1px solid rgba(255,255,255,0.9)`,
                      color: "#5C4566",
                      boxShadow:
                        "0 2px 6px rgba(200,170,220,0.2), inset 0 1px 2px rgba(255,255,255,0.7)",
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: "#6B4A7A",
                        boxShadow: "inset 0 1px 2px rgba(180,160,200,0.2)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-left truncate">{item}</span>
                    <span
                      className="text-xs opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#8A7A9A" }}
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
            className="mt-4 w-full py-2.5 rounded-xl text-xs tracking-wider transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(245,235,250,0.8)",
              color: "#9A8AAC",
              border: "1px solid rgba(230,215,240,0.6)",
            }}
          >
            ↺ 기본값으로 초기화 (1~12)
          </button>
        </div>
      </div>
    </div>
  );
}
