"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useGitState } from "@/hooks/useGitState";
import { executeCommand } from "@/lib/gitCommands";
import GitVisualization from "@/components/demo/GitVisualization";
import PRStatusPanel from "@/components/demo/PRStatusPanel";
import PRCreateModal from "@/components/demo/PRCreateModal";
import Terminal from "@/components/demo/Terminal";

const PRELOADED_COMMANDS = [
  "git checkout -b feature/saludo",
  "git add .",
  'git commit -m "add saludo"',
  "git push -u origin feature/saludo",
  "git pr create",
  "git pr approve",
  "git pr merge",
];

export default function Slide06Demo() {
  const [state, dispatch] = useGitState();
  const [preloadedIndex, setPreloadedIndex] = useState(0);
  const [showPRModal, setShowPRModal] = useState(false);

  const currentPreloadedCommand =
    preloadedIndex < PRELOADED_COMMANDS.length
      ? PRELOADED_COMMANDS[preloadedIndex]
      : null;

  const handleExecute = (command: string) => {
    const trimmed = command.trim();
    dispatch({ type: "APPEND_LINE", line: { type: "command", text: command } });

    executeCommand(command, state, dispatch);

    if (trimmed === "git pr create") {
      setShowPRModal(true);
      window.setTimeout(() => setShowPRModal(false), 2000);
    }

    if (trimmed === PRELOADED_COMMANDS[preloadedIndex]?.trim()) {
      window.setTimeout(() => {
        setPreloadedIndex((i) => i + 1);
      }, 700);
    }
  };

  const sourceForModal =
    state.currentBranch !== "master"
      ? state.currentBranch
      : "feature/saludo";

  return (
    <section className="relative w-screen h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden">
      <header className="flex justify-between items-center px-10 py-3 border-b border-[var(--color-divider)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-[var(--color-accent)] uppercase tracking-[0.28em] text-xs font-mono">
            Demo en vivo
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--color-text-secondary)]">
          single-repository · branch:{" "}
          <span className="text-[var(--color-text-primary)] font-semibold">
            {state.currentBranch}
          </span>
        </span>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 bg-[var(--color-bg-primary)]">
          <GitVisualization state={state} className="w-full h-full px-4 py-2" />
        </div>
        <PRStatusPanel
          filesChanged={state.filesChanged}
          status={state.prStatus}
          className="w-[280px] border-l border-[var(--color-divider)] flex-shrink-0"
        />
      </div>

      <Terminal
        onExecute={handleExecute}
        history={state.terminalHistory}
        preloadedCommand={currentPreloadedCommand}
        className="border-t border-[var(--color-divider)] h-[32vh] flex-shrink-0"
      />

      <AnimatePresence>
        {showPRModal && (
          <PRCreateModal key="pr-modal" sourceBranch={sourceForModal} />
        )}
      </AnimatePresence>
    </section>
  );
}
