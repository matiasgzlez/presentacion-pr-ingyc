"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { TerminalLine } from "@/types/git";

type TerminalProps = {
  onExecute: (command: string) => void;
  history: TerminalLine[];
  preloadedCommand: string | null;
  className?: string;
};

const TYPING_SPEED = 40;

export default function Terminal({
  onExecute,
  history,
  preloadedCommand,
  className = "",
}: TerminalProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userInterruptedRef = useRef(false);

  const commandHistory = useMemo(
    () =>
      history
        .filter((l): l is { type: "command"; text: string } => l.type === "command")
        .map((l) => l.text),
    [history],
  );

  // Auto-typewriter for preloaded commands
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    userInterruptedRef.current = false;

    if (!preloadedCommand) {
      setInput("");
      setIsTyping(false);
      return;
    }

    setInput("");
    setIsTyping(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (userInterruptedRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        return;
      }
      i += 1;
      setInput(preloadedCommand.slice(0, i));
      if (i >= preloadedCommand.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        inputRef.current?.focus();
      }
    }, TYPING_SPEED);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [preloadedCommand]);

  // Auto-scroll to bottom on new history
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [history.length]);

  // Keep focus on the input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const cancelTypewriter = () => {
    userInterruptedRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTyping(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isTyping) return;
    if (!input.trim()) return;
    onExecute(input);
    setInput("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      cancelTypewriter();
      const next = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(next);
      setInput(commandHistory[commandHistory.length - 1 - next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(commandHistory[commandHistory.length - 1 - next]);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
    // Any printable key while typewriter is running interrupts it
    if (isTyping && e.key.length === 1) {
      cancelTypewriter();
    }
  };

  return (
    <div
      className={`bg-[var(--color-bg-dark)] text-white font-mono text-sm flex flex-col ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-5 py-2 border-b border-white/10 select-none">
        <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
        <span className="ml-3 text-xs text-white/50 tracking-wide">
          ~/single-repository — zsh
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-0.5">
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "command"
                ? "text-white"
                : line.type === "error"
                  ? "text-red-400"
                  : line.type === "success"
                    ? "text-green-400"
                    : "text-gray-400"
            }
          >
            {line.type === "command" ? (
              <>
                <span className="text-[var(--color-accent)] mr-2">$</span>
                {line.text}
              </>
            ) : (
              <span className="whitespace-pre">{line.text}</span>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center px-5 pb-4 pt-2 border-t border-white/5"
      >
        <span className="text-[var(--color-accent)] mr-3 select-none">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            if (isTyping) cancelTypewriter();
            setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-white caret-[var(--color-accent)] font-mono"
        />
      </form>
    </div>
  );
}
