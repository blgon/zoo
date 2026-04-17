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
    "#FF6B6B", "#FF8E53", "#FFA500", "#FFD700",
    "#90EE90", "#00CED1", "#4169E1", "#8A2BE2",
    "#FF69B4", "#20B2AA", "#FF4500", "#32CD32",
  ];

  return (
    <div className="w-full max-w-sm">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#e0e0e0",
        }}
      >
        <span>항목 편집</span>
        <span
          className="transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>

      {/* Editor panel */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div
          className="mt-2 rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-xs text-gray-400 mb-3 text-center tracking-wide uppercase">
            항목을 클릭하여 수정하세요
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
                      className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-sm font-semibold text-white outline-none"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        border: `2px solid ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`,
                      }}
                    />
                    <button
                      onClick={commitEdit}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                      style={{ background: "#22c55e" }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                      style={{ background: "#ef4444" }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(i)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:scale-105 hover:brightness-110 active:scale-95 group"
                    style={{
                      background: `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}22`,
                      border: `1px solid ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}66`,
                      color: "#ffffff",
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        background: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                        color: "#fff",
                        fontSize: "10px",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-left truncate">{item}</span>
                    <span className="text-gray-500 group-hover:text-gray-300 text-xs">✎</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={resetDefaults}
            className="mt-3 w-full py-2 rounded-lg text-xs text-gray-400 hover:text-gray-200 transition-colors tracking-wide"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            기본값으로 초기화 (1~12)
          </button>
        </div>
      </div>
    </div>
  );
}
