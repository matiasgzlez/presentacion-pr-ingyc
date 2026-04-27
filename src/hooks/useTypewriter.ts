"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  speed?: number;
  delay?: number;
  enabled?: boolean;
  onDone?: () => void;
}

export function useTypewriter(
  text: string,
  { speed = 40, delay = 0, enabled = true, onDone }: UseTypewriterOptions = {},
) {
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setOutput("");
    setDone(false);

    if (!enabled) return;

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const startTimeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        if (cancelled) return;
        i += 1;
        setOutput(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
          onDone?.();
        }
      }, speed);
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay, enabled, onDone]);

  return { output, done };
}
