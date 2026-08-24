"use client";

import { useEffect, useRef } from "react";

// docs/07-design-system.md section 5.1: a continuous wave, muted, no mirroring,
// fast attack and slow decay so it does not jitter, and a minimum amplitude
// held at all times so a silent mic still reads as live rather than dead.
const ATTACK = 0.5;
const DECAY = 0.06;

// The quietest the trace is allowed to look, as a fraction of half the canvas.
// A real mic always has a noise floor, so rather than draw a fake wiggle the
// gain lifts until that real signal is visible, capped so a silent room does
// not turn into dramatic noise.
const MIN_VISIBLE = 0.12;
const MAX_GAIN = 8;

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
    const mid = height / 2;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    // Enough samples that the trace reads as a wave rather than a polyline.
    analyser.fftSize = 1024;
    source.connect(analyser);

    const samples = new Uint8Array(analyser.fftSize);
    let envelope = MIN_VISIBLE;
    let frameId: number;

    // docs/07 section 5.4: under reduced motion the waveform stays, because
    // proof the microphone is live is the accessibility floor here, but it
    // drops to a single level bar rising and falling in place.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smoothing belongs on the overall loudness, never on each sample. Sample
    // i is a different instant every frame, so smoothing per index flattens
    // the wave into a step instead of steadying it.
    function updateEnvelope() {
      let peak = 0;
      for (let i = 0; i < samples.length; i += 1) {
        peak = Math.max(peak, Math.abs(samples[i] / 128 - 1));
      }
      const rate = peak > envelope ? ATTACK : DECAY;
      envelope += (peak - envelope) * rate;
      return envelope;
    }

    function gainFor(level: number) {
      if (level <= 0.0001) {
        return MAX_GAIN;
      }
      return Math.min(MAX_GAIN, Math.max(1, MIN_VISIBLE / level));
    }

    function drawLevelBar(level: number) {
      const barHeight = Math.max(1.5, Math.min(1, level * gainFor(level)) * height);
      context.fillStyle = MUTED;
      context.fillRect(0, (height - barHeight) / 2, width, barHeight);
    }

    function drawWave(level: number) {
      const gain = gainFor(level);
      const step = width / (samples.length - 1);

      context.strokeStyle = MUTED;
      context.lineWidth = 1.5;
      context.lineJoin = "round";
      context.beginPath();

      for (let i = 0; i < samples.length; i += 1) {
        const amplitude = (samples[i] / 128 - 1) * gain;
        const y = mid - Math.max(-1, Math.min(1, amplitude)) * mid;
        if (i === 0) {
          context.moveTo(0, y);
        } else {
          context.lineTo(i * step, y);
        }
      }

      context.stroke();
    }

    function draw() {
      analyser.getByteTimeDomainData(samples);
      const level = updateEnvelope();

      context.clearRect(0, 0, width, height);
      if (reduceMotion) {
        drawLevelBar(level);
      } else {
        drawWave(level);
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

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={96}
      aria-hidden="true"
      className="w-full max-w-130"
    />
  );
}
