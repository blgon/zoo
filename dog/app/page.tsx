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
          "linear-gradient(135deg, #F5E6CF 0%, #EED9B8 40%, #E3C79E 80%, #D6B887 100%)",
      }}
    >
      {/* 한지(Hanji) paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(120,80,40,0.08) 1px, transparent 1.5px), radial-gradient(rgba(120,80,40,0.05) 1px, transparent 2px)",
          backgroundSize: "14px 14px, 22px 22px",
          backgroundPosition: "0 0, 7px 11px",
        }}
      />

      {/* Background decorative blobs - 단청 tones */}
      <div
        className="absolute top-10 -left-40 w-[28rem] h-[28rem] rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,76,76,0.28) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 -right-40 w-[28rem] h-[28rem] rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(62,94,133,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(79,138,108,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Title */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <span
            className="w-12 h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, #9A2E2E)" }}
          />
          <span
            className="text-xs tracking-[0.5em] font-semibold"
            style={{ color: "#9A2E2E" }}
          >
            福 · 운수대길 · 福
          </span>
          <span
            className="w-12 h-[1px]"
            style={{ background: "linear-gradient(90deg, #9A2E2E, transparent)" }}
          />
        </div>
        <h1
          className="text-6xl font-black tracking-tight mb-2"
          style={{
            fontFamily: '"Noto Serif KR", "Nanum Myeongjo", serif',
            background:
              "linear-gradient(135deg, #9A2E2E 0%, #3E2B1F 55%, #3E5E85 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 4px 10px rgba(100,50,30,0.25))",
          }}
        >
          돌림판
        </h1>
        <p
          className="text-sm tracking-[0.3em]"
          style={{ color: "#6B4A2E" }}
        >
          12 칸 · 언제든 수정 가능
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
          {/* Info card - 한지 style */}
          <div
            className="w-full rounded-2xl p-6"
            style={{
              background: "rgba(255,248,236,0.85)",
              border: "1px solid rgba(154,46,46,0.3)",
              backdropFilter: "blur(8px)",
              boxShadow:
                "0 10px 30px rgba(120,70,40,0.15), inset 0 2px 4px rgba(255,255,255,0.6)",
            }}
          >
            <h2
              className="font-bold text-base mb-3 tracking-wider"
              style={{
                color: "#9A2E2E",
                fontFamily: '"Noto Serif KR", "Nanum Myeongjo", serif',
              }}
            >
              ◆ 사 용 법
            </h2>
            <ul className="text-sm space-y-2" style={{ color: "#5A3F28" }}>
              <li className="flex items-start gap-2">
                <span style={{ color: "#C94C4C" }} className="mt-0.5">
                  ❁
                </span>
                <span>돌려라 버튼을 눌러 판을 돌려보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#E0A84E" }} className="mt-0.5">
                  ❁
                </span>
                <span>상단 포인터가 가리키는 항목이 당첨됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#4F8A6C" }} className="mt-0.5">
                  ❁
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
