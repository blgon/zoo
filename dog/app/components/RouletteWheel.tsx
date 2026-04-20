"use client";

import { useRef, useState, useCallback } from "react";

// 한국 전통색 (단청 · 한복 계열) 12색
const SEGMENT_COLORS = [
  "#C94C4C", // 홍(紅) - 단청 빨강
  "#D97A4F", // 주(朱) - 주홍
  "#E0A84E", // 치자(梔子) - 황토 옐로우
  "#CDBB5A", // 송화(松花) - 올리브 옐로우
  "#8FA864", // 연두(軟豆)
  "#4F8A6C", // 옥(玉) - 진한 옥빛
  "#5A8FA8", // 담청(淡靑)
  "#3E5E85", // 군청(群靑)
  "#6E4F8C", // 자(紫)
  "#9A5B8A", // 자홍(紫紅)
  "#A8615E", // 매(梅) - 매실홍
  "#8C6A4A", // 황토갈(黃土褐)
];

interface RouletteWheelProps {
  items: string[];
}

export default function RouletteWheel({ items }: RouletteWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotationRef = useRef(0);

  const segmentCount = items.length;
  const segmentAngle = (2 * Math.PI) / segmentCount;

  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D, rot: number) => {
      const canvas = ctx.canvas;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Outer decorative ring (soft ink glow)
      const ringGrad = ctx.createRadialGradient(cx, cy, radius - 2, cx, cy, radius + 18);
      ringGrad.addColorStop(0, "rgba(255,255,255,0.0)");
      ringGrad.addColorStop(0.5, "rgba(201,76,76,0.22)");
      ringGrad.addColorStop(1, "rgba(94,67,46,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 14, 0, 2 * Math.PI);
      ctx.fillStyle = ringGrad;
      ctx.fill();

      // Outer bezel - 단청 red
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = "#B44242";
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius + 7, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(245,230,210,0.95)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Segments
      for (let i = 0; i < segmentCount; i++) {
        const startAngle = rot + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // Segment fill with soft pastel gradient
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();

        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        const grad = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius);
        grad.addColorStop(0, lightenColor(color, 28));
        grad.addColorStop(0.55, color);
        grad.addColorStop(1, darkenColor(color, 18));
        ctx.fillStyle = grad;
        ctx.fill();

        // Soft separator lines (한지 톤)
        ctx.strokeStyle = "rgba(245,230,210,0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Decorative dot near outer edge
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.beginPath();
        ctx.arc(radius - 22, 0, 3.2, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(245,230,210,0.95)";
        ctx.fill();
        ctx.restore();

        // Text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#FAF2E3";
        ctx.shadowColor = "rgba(40,24,16,0.55)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;
        ctx.font = `800 ${radius > 150 ? 18 : 13}px "Geist", "Noto Serif KR", "Nanum Myeongjo", serif`;
        const label = items[i] ?? String(i + 1);
        const maxWidth = radius * 0.6;
        ctx.fillText(label, radius - 36, 6, maxWidth);
        ctx.restore();
      }

      // Inner decorative ring
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(245,230,210,0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center hub - 한지 ivory
      const hubGrad = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx, cy, 40);
      hubGrad.addColorStop(0, "#FFF8EC");
      hubGrad.addColorStop(0.55, "#F5E6CF");
      hubGrad.addColorStop(1, "#E3CBA4");
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, 2 * Math.PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.strokeStyle = "#B44242";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner hub ring
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(180,70,70,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center dot - 단청 red
      const dotGrad = ctx.createRadialGradient(cx - 3, cy - 3, 0, cx, cy, 13);
      dotGrad.addColorStop(0, "#E67373");
      dotGrad.addColorStop(1, "#A0302F");
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, 2 * Math.PI);
      ctx.fillStyle = dotGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(250,242,227,0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [items, segmentAngle, segmentCount]
  );

  const spinWheel = useCallback(() => {
    if (spinning) return;
    setShowWinner(false);
    setWinner(null);
    setSpinning(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.random() * 2 * Math.PI;
    const totalRotation = extraSpins * 2 * Math.PI + randomAngle;
    const duration = 4000 + Math.random() * 2000;
    const startTime = performance.now();
    const startRot = currentRotationRef.current;

    const easeOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentRot = startRot + totalRotation * easedProgress;

      currentRotationRef.current = currentRot;
      drawWheel(ctx, currentRot - Math.PI / 2);
      setRotation(currentRot);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        // Determine winner: pointer is at top (angle = -PI/2 from center)
        const normalizedAngle =
          ((currentRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (2 * Math.PI - normalizedAngle) % (2 * Math.PI);
        const winnerIndex =
          Math.floor(pointerAngle / segmentAngle) % segmentCount;
        setWinner(items[winnerIndex] ?? String(winnerIndex + 1));
        setShowWinner(true);
      }
    };

    requestAnimationFrame(animate);
  }, [spinning, drawWheel, segmentAngle, segmentCount, items]);

  // Initial draw
  const canvasCallbackRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current =
        canvas;
      const ctx = canvas.getContext("2d");
      if (ctx) drawWheel(ctx, -Math.PI / 2);
    },
    [drawWheel]
  );

  // Redraw when items change
  const prevItemsRef = useRef<string[]>([]);
  if (JSON.stringify(prevItemsRef.current) !== JSON.stringify(items)) {
    prevItemsRef.current = items;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) drawWheel(ctx, currentRotationRef.current - Math.PI / 2);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel container */}
      <div className="relative">
        {/* Pointer - 단청 red tassel */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10"
          style={{ filter: "drop-shadow(0 4px 8px rgba(100,30,30,0.35))" }}
        >
          <svg width="48" height="56" viewBox="0 0 48 56">
            <defs>
              <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E88888" />
                <stop offset="55%" stopColor="#C94C4C" />
                <stop offset="100%" stopColor="#9A2E2E" />
              </linearGradient>
            </defs>
            <path
              d="M 24 54 L 5 20 Q 5 4, 24 4 Q 43 4, 43 20 Z"
              fill="url(#pointerGrad)"
              stroke="#FAF2E3"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="20" r="4" fill="#FAF2E3" opacity="0.95" />
          </svg>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasCallbackRef}
          width={480}
          height={480}
          className="rounded-full"
          style={{
            filter: spinning
              ? "drop-shadow(0 8px 28px rgba(200,170,220,0.45))"
              : "drop-shadow(0 6px 20px rgba(200,170,220,0.3))",
            transition: "filter 0.3s ease",
          }}
        />
      </div>

      {/* Spin button - 단청 red pill */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`
          relative px-14 py-4 rounded-full text-xl font-extrabold tracking-[0.3em]
          transition-all duration-300 select-none
          ${
            spinning
              ? "cursor-not-allowed scale-95"
              : "cursor-pointer hover:scale-105 active:scale-95"
          }
        `}
        style={
          spinning
            ? {
                background: "linear-gradient(135deg, #D8CCB9, #BFAE97)",
                color: "#7A6A56",
                boxShadow:
                  "inset 0 2px 6px rgba(120,90,60,0.25), 0 2px 8px rgba(120,90,60,0.15)",
              }
            : {
                background:
                  "linear-gradient(135deg, #D96666 0%, #C94C4C 45%, #9A2E2E 100%)",
                color: "#FAF2E3",
                border: "2px solid #FAF2E3",
                boxShadow:
                  "0 10px 28px rgba(154,46,46,0.4), inset 0 2px 6px rgba(255,230,210,0.35), inset 0 -3px 6px rgba(60,20,20,0.3)",
                textShadow: "0 1px 2px rgba(60,20,20,0.45)",
              }
        }
      >
        {spinning ? (
          <span className="flex items-center gap-2">
            <span className="inline-block animate-spin">❁</span> 돌아가는 중...
          </span>
        ) : (
          "돌려라"
        )}
      </button>

      {/* Winner display */}
      {showWinner && winner && (
        <div
          className="winner-pulse px-10 py-5 rounded-2xl text-center"
          style={{
            background:
              "linear-gradient(135deg, #FFF8EC 0%, #F5E6CF 100%)",
            border: "2px solid #C94C4C",
            boxShadow:
              "0 10px 30px rgba(154,46,46,0.25), inset 0 2px 6px rgba(255,248,236,0.8)",
          }}
        >
          <p
            className="text-xs tracking-[0.4em] mb-1.5 font-semibold"
            style={{ color: "#9A2E2E" }}
          >
            ◆ 당 첨 ◆
          </p>
          <p
            className="text-3xl font-extrabold"
            style={{
              color: "#3E2B1F",
              textShadow: "0 2px 4px rgba(250,242,227,0.9)",
            }}
          >
            {winner}
          </p>
        </div>
      )}
    </div>
  );
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}
