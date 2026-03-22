"use client";

import React, { useRef, useEffect, useCallback } from "react";

export function WaveHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight ?? window.innerHeight;
    };
    resize();

    const waves = [
      { amp: 30, freq: 0.003, speed: 0.02, offset: 0, opacity: 0.9 },
      { amp: 25, freq: 0.004, speed: 0.015, offset: Math.PI * 0.5, opacity: 0.7 },
      { amp: 20, freq: 0.005, speed: 0.025, offset: Math.PI, opacity: 0.5 },
      { amp: 35, freq: 0.002, speed: 0.01, offset: Math.PI * 1.5, opacity: 0.6 },
    ];

    // Pre-generate grain image data
    let grainImageData = ctx.createImageData(width, height);
    let grainFrame = 0;

    const updateGrain = () => {
      grainFrame++;
      if (grainFrame % 3 !== 0) return;
      const d = grainImageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
    };

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      frame++;

      ctx.fillStyle = "rgba(0, 0, 0, 0.92)";
      ctx.fillRect(0, 0, width, height);

      const t = frame * 0.01;
      const bass = 0.4 + Math.sin(t) * 0.3;
      const mid = 0.3 + Math.sin(t * 1.5) * 0.2;
      const hue = 200 + Math.sin(t * 0.5) * 20;
      const centerY = height / 2;

      waves.forEach((w, i) => {
        w.offset += w.speed * (1 + bass * 0.8);
        const dynAmp = w.amp * (1 + (i < 2 ? bass : mid) * 5);
        const wHue = hue + i * 15;
        const alpha = w.opacity * (0.5 + bass * 0.5);

        const grad = ctx.createLinearGradient(0, centerY - dynAmp, 0, centerY + dynAmp);
        grad.addColorStop(0, `hsla(${wHue}, 75%, 55%, 0)`);
        grad.addColorStop(0.5, `hsla(${wHue}, 75%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${wHue}, 75%, 55%, 0)`);

        ctx.beginPath();
        for (let x = -50; x <= width + 50; x += 2) {
          const y1 = Math.sin(x * w.freq + w.offset) * dynAmp;
          const y2 = Math.sin(x * w.freq * 2 + w.offset * 1.5) * dynAmp * 0.3 * mid;
          const y3 = Math.sin(x * w.freq * 0.5 + w.offset * 0.7) * dynAmp * 0.5;
          const y = centerY + y1 + y2 + y3;
          if (x === -50) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(width + 50, height);
        ctx.lineTo(-50, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Film grain
      updateGrain();
      const grainCanvas = document.createElement("canvas");
      grainCanvas.width = width;
      grainCanvas.height = height;
      const gCtx = grainCanvas.getContext("2d")!;
      gCtx.putImageData(grainImageData, 0, 0);

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.025;
      ctx.drawImage(grainCanvas, 0, 0);
      ctx.restore();

      // Scanlines
      ctx.strokeStyle = "rgba(0, 0, 0, 0.02)";
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vignette
      const vig = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.2,
        width / 2, height / 2, width * 0.9,
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(0.5, "rgba(0,0,0,0.12)");
      vig.addColorStop(0.8, "rgba(0,0,0,0.24)");
      vig.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      // Film flicker
      const flicker = Math.sin(frame * 0.3) * 0.015 + Math.random() * 0.008;
      ctx.fillStyle = `rgba(255,255,255,${flicker})`;
      ctx.fillRect(0, 0, width, height);

      // Occasional dust
      if (Math.random() < 0.015) {
        for (let n = 0; n < 3; n++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
          ctx.beginPath();
          ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    animate();
    window.addEventListener("resize", () => {
      resize();
      grainImageData = ctx.createImageData(width, height);
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const cleanup = initCanvas();
    return cleanup;
  }, [initCanvas]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
