"use client";

import { useEffect } from "react";
import type { KeyboardShortcutHandlers } from "@/types";

function toggleFullscreen() {
  if (typeof document === "undefined") return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

export function useKeyboardShortcuts({
  onNext,
  onPrev,
  onReset,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          event.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          onPrev();
          break;
        case "Escape":
          event.preventDefault();
          onReset();
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev, onReset]);
}
