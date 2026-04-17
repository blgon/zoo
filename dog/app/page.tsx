"use client";

import { useState } from "react";
import RouletteWheel from "./components/RouletteWheel";
import ItemEditor from "./components/ItemEditor";

const DEFAULT_ITEMS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export default function Home() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,165,0,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(65,105,225,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(138,43,226,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Title */}
      <div className="text-center mb-10 z-10">
        <h1
          className="text-5xl font-black tracking-tight mb-2"
          style={{
            background: "linear-gradient(135deg, #FFD700, #FFA500, #FF6B6B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 20px rgba(255,165,0,0.4))",
          }}
        >
          ROULETTE
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase">
          12-Segment Wheel
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 z-10 w-full max-w-5xl">
        {/* Wheel */}
        <div className="flex-shrink-0">
          <RouletteWheel items={items} />
        </div>

        {/* Side panel */}
        <div className="flex flex-col items-center lg:items-start gap-6 w-full max-w-sm">
          {/* Info card */}
          <div
            className="w-full rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 className="text-white font-bold text-lg mb-2">사용 방법</h2>
            <ul className="text-gray-400 text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">▶</span>
                <span>SPIN! 버튼을 눌러 룰렛을 돌리세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">▶</span>
                <span>상단 화살표가 가리키는 항목이 당첨됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">▶</span>
                <span>항목 편집에서 텍스트를 자유롭게 바꿀 수 있어요</span>
              </li>
            </ul>
          </div>

          {/* Item editor */}
          <ItemEditor items={items} onChange={setItems} />
        </div>
      </div>
    </main>
  );
}
