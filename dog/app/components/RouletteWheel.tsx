"use client";

import { useRef, useState, useCallback } from "react";

const SEGMENT_COLORS = [
  "#FF6B6B", "#FF8E53", "#FFA500", "#FFD700",
  "#90EE90", "#00CED1", "#4169E1", "#8A2BE2",
  "#FF69B4", "#20B2AA", "#FF4500", "#32CD32",
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

      // Outer glow ring
      const glowGrad = ctx.createRadialGradient(cx, cy, radius - 5, cx, cy, radius + 12);
      glowGrad.addColorStop(0, "rgba(255,215,0,0.6)");
      glowGrad.addColorStop(1, "rgba(255,165,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 6, 0, 2 * Math.PI);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Segments
      for (let i = 0; i < segmentCount; i++) {
        const startAngle = rot + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        grad.addColorStop(0, lightenColor(color, 40));
        grad.addColorStop(0.6, color);
        grad.addColorStop(1, darkenColor(color, 30));
        ctx.fillStyle = grad;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.font = `bold ${radius > 150 ? 16 : 12}px Arial`;
        const label = items[i] ?? String(i + 1);
        const maxWidth = radius * 0.7;
        ctx.fillText(label, radius - 16, 6, maxWidth);
        ctx.restore();
      }

      // Center hub
      const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      hubGrad.addColorStop(0, "#ffffff");
      hubGrad.addColorStop(0.5, "#e0e0e0");
      hubGrad.addColorStop(1, "#999999");
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffd700";
      ctx.fill();
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
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "32px solid #FFD700",
            }}
          />
          <div
            className="w-0 h-0 -mt-2"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "16px solid #FFA500",
              marginLeft: "6px",
            }}
          />
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasCallbackRef}
          width={480}
          height={480}
          className="rounded-full"
          style={{
            filter: spinning
              ? "drop-shadow(0 0 20px rgba(255,165,0,0.8))"
              : "drop-shadow(0 0 10px rgba(255,215,0,0.4))",
            transition: "filter 0.3s ease",
          }}
        />
      </div>

      {/* Spin button */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`
          relative px-12 py-4 rounded-full text-xl font-bold tracking-widest uppercase
          transition-all duration-300 select-none
          ${
            spinning
              ? "bg-gray-700 text-gray-400 cursor-not-allowed scale-95"
              : "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95"
          }
        `}
        style={
          !spinning
            ? {
                boxShadow:
                  "0 0 20px rgba(255,165,0,0.6), 0 4px 15px rgba(0,0,0,0.4)",
              }
            : {}
        }
      >
        {spinning ? (
          <span className="flex items-center gap-2">
            <span className="inline-block animate-spin">⚙</span> 돌아가는 중...
          </span>
        ) : (
          "SPIN!"
        )}
      </button>

      {/* Winner display */}
      {showWinner && winner && (
        <div
          className="winner-pulse px-8 py-4 rounded-2xl text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.1))",
            border: "2px solid #FFD700",
          }}
        >
          <p className="text-sm text-yellow-400 uppercase tracking-widest mb-1">
            당첨!
          </p>
          <p className="text-3xl font-bold text-white text-glow">{winner}</p>
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
