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
        background:
          "linear-gradient(135deg, #FFF5F7 0%, #FFEEF3 25%, #F3E8FF 60%, #E8F0FF 100%)",
      }}
    >
      {/* Background decorative blobs */}
      <div
        className="absolute top-10 -left-40 w-[28rem] h-[28rem] rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,220,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 -right-40 w-[28rem] h-[28rem] rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(200,220,255,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(220,200,255,0.45) 0%, transparent 70%)",
        }}
      />

      {/* Title */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <span
            className="w-12 h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, #D5B5E5)" }}
          />
          <span
            className="text-xs tracking-[0.4em] uppercase font-semibold"
            style={{ color: "#B77A9C" }}
          >
            Lucky Wheel
          </span>
          <span
            className="w-12 h-[1px]"
            style={{ background: "linear-gradient(90deg, #D5B5E5, transparent)" }}
          />
        </div>
        <h1
          className="text-6xl font-black tracking-tight mb-2"
          style={{
            background:
              "linear-gradient(135deg, #F5A5C5 0%, #D5A5E5 50%, #A5B5E5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 4px 12px rgba(230,180,220,0.3))",
          }}
        >
          Roulette
        </h1>
        <p
          className="text-sm tracking-[0.2em]"
          style={{ color: "#9A8AAC" }}
        >
          12 segments · edit anytime
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
            className="w-full rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 10px 30px rgba(200,170,220,0.2), inset 0 2px 4px rgba(255,255,255,0.6)",
            }}
          >
            <h2
              className="font-bold text-base mb-3 tracking-wide"
              style={{ color: "#6B4A7A" }}
            >
              ✨ 사용 방법
            </h2>
            <ul className="text-sm space-y-2" style={{ color: "#8A7A9A" }}>
              <li className="flex items-start gap-2">
                <span style={{ color: "#F5A5C5" }} className="mt-0.5">
                  ❀
                </span>
                <span>Spin 버튼을 눌러 룰렛을 돌려보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#D5A5E5" }} className="mt-0.5">
                  ❀
                </span>
                <span>상단 포인터가 가리키는 항목이 당첨됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#A5B5E5" }} className="mt-0.5">
                  ❀
                </span>
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
