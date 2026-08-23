"use client";

import { useEffect, useRef } from "react";

// The only feedback shown during recording (docs/04 section 1.2) — deliberately
// static styling throughout, no urgency cues as the countdown nears zero.
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
    let frameId: number;

    function draw() {
      analyser.getByteTimeDomainData(data);
      context.clearRect(0, 0, width, height);
      context.beginPath();

      const sliceWidth = width / data.length;
      let x = 0;
      for (let i = 0; i < data.length; i += 1) {
        const y = (data[i] / 255) * height;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
        x += sliceWidth;
      }

      context.stroke();
      frameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(frameId);
      source.disconnect();
      void audioContext.close();
    };
  }, [stream, active]);

  return <canvas ref={canvasRef} width={300} height={60} />;
}
