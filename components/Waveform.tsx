"use client";

import { useEffect, useRef } from "react";

// docs/07-design-system.md section 5.1: muted, no mirroring, fast attack and
// slow decay so it doesn't jitter, and a minimum amplitude held at all times
// so a silent mic still reads as live rather than dead.
const ATTACK = 0.6;
const DECAY = 0.08;
const MIN_AMPLITUDE = 0.08;
// Canvas cannot read the CSS custom property, so the `muted` token from
// docs/07-design-system.md section 3 is duplicated here. Keep both in step.
const MUTED = "#696F66";

// The only feedback shown during recording (docs/04 section 1.2). Deliberately
// static styling throughout, no urgency cues as the countdown nears zero.
//
// The canvas is aria-hidden: it is the visual proof the mic is live, and the
// countdown text beside it carries the same fact for assistive technology.
export function Waveform({ stream, active }: { stream: MediaStream; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    const canvas = canvasRef.current;
    const maybeContext = canvas?.getContext("2d");
    if (!canvas || !maybeContext) {
      return;
    }
    const context: CanvasRenderingContext2D = maybeContext;
    const { width, height } = canvas;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const smoothed = new Float32Array(analyser.frequencyBinCount);
    let level = MIN_AMPLITUDE;
    let frameId: number;

    // docs/07 section 5.4: under reduced motion the waveform stays, because
    // proof the microphone is live is the accessibility floor here, but it
    // drops to a single level bar rising and falling in place.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function peakAmplitude() {
      let peak = 0;
      for (let i = 0; i < data.length; i += 1) {
        peak = Math.max(peak, Math.abs(data[i] / 255 - 0.5) * 2);
      }
      return Math.max(peak, MIN_AMPLITUDE);
    }

    function drawLevelBar() {
      const target = peakAmplitude();
      level += (target - level) * (target > level ? ATTACK : DECAY);

      const barHeight = Math.max(1.5, level * height);
      context.fillStyle = MUTED;
      context.fillRect(0, (height - barHeight) / 2, width, barHeight);
    }

    function drawWave() {
      context.strokeStyle = MUTED;
      context.lineWidth = 1.5;
      context.beginPath();

      const sliceWidth = width / data.length;
      let x = 0;
      for (let i = 0; i < data.length; i += 1) {
        const target = Math.max(Math.abs(data[i] / 255 - 0.5) * 2, MIN_AMPLITUDE);
        const rate = target > smoothed[i] ? ATTACK : DECAY;
        smoothed[i] += (target - smoothed[i]) * rate;

        const offset = (data[i] / 255 - 0.5 >= 0 ? 1 : -1) * smoothed[i];
        const y = height / 2 - offset * (height / 2);
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
        x += sliceWidth;
      }

      context.stroke();
    }

    function draw() {
      analyser.getByteTimeDomainData(data);
      context.clearRect(0, 0, width, height);

      if (reduceMotion) {
        drawLevelBar();
      } else {
        drawWave();
      }

      frameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(frameId);
      source.disconnect();
      void audioContext.close();
    };
  }, [stream, active]);

  return <canvas ref={canvasRef} width={300} height={60} aria-hidden="true" />;
}
