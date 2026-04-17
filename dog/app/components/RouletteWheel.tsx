"use client";

import { useRef, useState, useCallback } from "react";

const SEGMENT_COLORS = [
  "#FFB5C2", // soft pink
  "#FFCFA8", // peach
  "#FFE5A8", // butter cream
  "#F5F0B0", // lemon chiffon
  "#D6F0B5", // mint
  "#B5EAD7", // aqua mint
  "#B5DCE8", // sky blue
  "#C4C9F0", // periwinkle
  "#D5BFEA", // lavender
  "#EAC0E0", // lilac pink
  "#F5C7C0", // blush
  "#F0D9B5", // sand
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

      // Outer decorative ring (soft pastel glow)
      const ringGrad = ctx.createRadialGradient(cx, cy, radius - 2, cx, cy, radius + 18);
      ringGrad.addColorStop(0, "rgba(255,255,255,0.0)");
      ringGrad.addColorStop(0.5, "rgba(255,228,240,0.35)");
      ringGrad.addColorStop(1, "rgba(200,180,220,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 14, 0, 2 * Math.PI);
      ctx.fillStyle = ringGrad;
      ctx.fill();

      // Outer bezel
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius + 6, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(230,215,240,0.6)";
      ctx.lineWidth = 2;
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
        grad.addColorStop(0, lightenColor(color, 18));
        grad.addColorStop(0.55, color);
        grad.addColorStop(1, darkenColor(color, 10));
        ctx.fillStyle = grad;
        ctx.fill();

        // Soft separator lines
        ctx.strokeStyle = "rgba(255,255,255,0.75)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Decorative dot near outer edge
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.beginPath();
        ctx.arc(radius - 22, 0, 3.2, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
        ctx.restore();

        // Text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#4a3a5c";
        ctx.shadowColor = "rgba(255,255,255,0.7)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetY = 1;
        ctx.font = `700 ${radius > 150 ? 17 : 12}px "Geist", "Pretendard", Arial, sans-serif`;
        const label = items[i] ?? String(i + 1);
        const maxWidth = radius * 0.6;
        ctx.fillText(label, radius - 36, 6, maxWidth);
        ctx.restore();
      }

      // Inner decorative ring
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center hub - soft pastel
      const hubGrad = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx, cy, 38);
      hubGrad.addColorStop(0, "#ffffff");
      hubGrad.addColorStop(0.5, "#fff4f8");
      hubGrad.addColorStop(1, "#e8dcf0");
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, 2 * Math.PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(180,160,200,0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner hub ring
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(220,200,235,0.7)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center dot - soft pastel
      const dotGrad = ctx.createRadialGradient(cx - 3, cy - 3, 0, cx, cy, 12);
      dotGrad.addColorStop(0, "#ffc5da");
      dotGrad.addColorStop(1, "#e8a5c5");
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
      ctx.fillStyle = dotGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
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
        {/* Pointer - pastel heart/droplet */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"
          style={{ filter: "drop-shadow(0 4px 8px rgba(180,140,200,0.35))" }}
        >
          <svg width="44" height="52" viewBox="0 0 44 52">
            <defs>
              <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD4E0" />
                <stop offset="100%" stopColor="#E8A5C5" />
              </linearGradient>
            </defs>
            <path
              d="M 22 50 L 4 18 Q 4 4, 22 4 Q 40 4, 40 18 Z"
              fill="url(#pointerGrad)"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="18" r="4" fill="#ffffff" opacity="0.9" />
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

      {/* Spin button - pastel rounded pill */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`
          relative px-14 py-4 rounded-full text-lg font-bold tracking-[0.2em] uppercase
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
                background: "linear-gradient(135deg, #e8e1ee, #d8d0e0)",
                color: "#9990a5",
                boxShadow:
                  "inset 0 2px 6px rgba(180,160,200,0.3), 0 2px 8px rgba(180,160,200,0.15)",
              }
            : {
                background:
                  "linear-gradient(135deg, #FFD4E0 0%, #FFC5D5 40%, #E8B5DB 100%)",
                color: "#6B4862",
                boxShadow:
                  "0 8px 24px rgba(232,165,197,0.45), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(180,120,160,0.15)",
              }
        }
      >
        {spinning ? (
          <span className="flex items-center gap-2">
            <span className="inline-block animate-spin">✿</span> 돌아가는 중...
          </span>
        ) : (
          "Spin"
        )}
      </button>

      {/* Winner display */}
      {showWinner && winner && (
        <div
          className="winner-pulse px-10 py-5 rounded-3xl text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,212,224,0.9), rgba(214,240,181,0.85))",
            border: "2px solid rgba(255,255,255,0.85)",
            boxShadow:
              "0 10px 30px rgba(232,165,197,0.35), inset 0 2px 6px rgba(255,255,255,0.6)",
          }}
        >
          <p
            className="text-xs uppercase tracking-[0.3em] mb-1.5"
            style={{ color: "#B77A9C" }}
          >
            ✦ 당첨 ✦
          </p>
          <p
            className="text-3xl font-extrabold"
            style={{
              color: "#5C4566",
              textShadow: "0 2px 4px rgba(255,255,255,0.8)",
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
