import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMusic } from '../../contexts/MusicContext';

/** Two soft lines that breathe with the atmosphere's amplitude. */
export function Waveform({ className = '' }: {className?: string;}) {
  const { getAnalyser, playing } = useMusic();
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const data = new Uint8Array(256);
    let frame = 0;
    let phase = 0;
    let level = 0.04;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const analyser = getAnalyser();
      let amp = 0;
      if (playing && analyser) {
        analyser.getByteTimeDomainData(data);
        for (let i = 0; i < data.length; i += 1) amp = Math.max(amp, Math.abs(data[i] - 128) / 128);
      }
      const target = playing ? Math.min(1, 0.22 + amp * 3) : 0.03;
      level += (target - level) * 0.08;

      [
      { freq: 4, alpha: 0.9, offset: 0 },
      { freq: 6.5, alpha: 0.35, offset: 1.7 }].
      forEach(({ freq, alpha, offset }) => {
        ctx.beginPath();
        ctx.lineWidth = 1.2 * dpr;
        ctx.strokeStyle = `rgba(242,237,227,${alpha})`;
        for (let x = 0; x <= w; x += 2 * dpr) {
          const t = x / w;
          const y = h / 2 + Math.sin(t * Math.PI * freq + phase + offset) * h * 0.38 * level * Math.sin(t * Math.PI);
          if (x === 0) ctx.moveTo(x, y);else
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      phase += 0.035;
      if (playing && !reduce) frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [playing, getAnalyser, reduce]);

  return <canvas ref={ref} aria-hidden className={className} />;
}