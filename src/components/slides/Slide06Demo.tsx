"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

const STEP_EXPLANATIONS = [
  "Crea una branch nueva a partir de main y nos cambiamos a ella.",
  "Marca todos los archivos modificados para incluirlos en el próximo commit.",
  "Confirma los cambios marcados como un commit en la branch local.",
  "Sube la branch al servidor remoto. Sin esto, nadie más ve tus cambios.",
  "Abre el Pull Request: pide revisión formal del equipo antes del merge.",
  "Un revisor lee el código y lo aprueba. El PR queda listo para integrarse.",
  "Integra la branch a main. La feature ya está en producción.",
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
    }

    if (trimmed === PRELOADED_COMMANDS[preloadedIndex]?.trim()) {
      window.setTimeout(() => {
        setPreloadedIndex((i) => i + 1);
      }, 700);
    }
  };

  const closePRModal = () => setShowPRModal(false);

  const handleReset = () => {
    dispatch({ type: "RESET" });
    setPreloadedIndex(0);
    setShowPRModal(false);
  };

  const sourceForModal =
    state.currentBranch !== "main"
      ? state.currentBranch
      : "feature/saludo";

  const onFeatureBranch = state.currentBranch !== "main";

  return (
    <section className="relative w-screen h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden">
      <div className="flex items-center gap-5 px-10 py-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-divider)] flex-shrink-0">
        <span className="font-mono text-base uppercase tracking-[0.22em] text-[var(--color-accent)] font-bold whitespace-nowrap">
          Paso {Math.min(preloadedIndex + 1, PRELOADED_COMMANDS.length)} / {PRELOADED_COMMANDS.length}
        </span>
        <span className="text-xl text-[var(--color-text-primary)] leading-snug flex-1">
          {STEP_EXPLANATIONS[Math.min(preloadedIndex, STEP_EXPLANATIONS.length - 1)]}
        </span>
        <button
          onClick={handleReset}
          className="flex-shrink-0 flex items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] px-4 py-2 rounded-lg border border-[var(--color-divider)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >
          ↺ Reiniciar
        </button>
      </div>

      <div className="flex flex-shrink-0 border-b border-[var(--color-divider)] h-[38vh]">
        <Terminal
          onExecute={handleExecute}
          history={state.terminalHistory}
          preloadedCommand={currentPreloadedCommand}
          className="flex-1 min-w-0 h-full"
        />
        <PRStatusPanel
          filesChanged={state.filesChanged}
          status={state.prStatus}
          className="w-[400px] border-l border-[var(--color-divider)] flex-shrink-0 h-full overflow-y-auto"
        />
      </div>

      <div className="relative flex-1 min-h-0 bg-[var(--color-bg-primary)] flex items-center justify-center">
        <motion.div
          key={state.currentBranch}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 left-6 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[var(--color-divider)] shadow-sm"
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: onFeatureBranch ? "#FF6B35" : "#0A0A0A",
            }}
          />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
            branch
          </span>
          <span
            className="font-mono text-base font-bold"
            style={{
              color: onFeatureBranch ? "#FF6B35" : "#0A0A0A",
            }}
          >
            {state.currentBranch}
          </span>
        </motion.div>
        <GitVisualization state={state} className="w-full h-full px-6 py-2" />
      </div>

      <AnimatePresence>
        {showPRModal && (
          <PRCreateModal
            key="pr-modal"
            sourceBranch={sourceForModal}
            onClose={closePRModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
