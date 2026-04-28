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

  const sourceForModal =
    state.currentBranch !== "main"
      ? state.currentBranch
      : "feature/saludo";

  return (
    <section className="relative w-screen h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden">
      <header className="flex justify-between items-center px-10 py-4 border-b border-[var(--color-divider)] flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="w-3 h-3 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-[var(--color-accent)] uppercase tracking-[0.28em] text-xl font-mono font-bold">
            Demo en vivo
          </span>
          <span className="ml-4 text-[var(--color-text-secondary)] text-xl font-mono">
            Los 3 comandos del slide anterior, ahora en vivo
          </span>
        </div>
        <span className="font-mono text-xl text-[var(--color-text-secondary)]">
          branch:{" "}
          <span className="text-[var(--color-text-primary)] font-bold">
            {state.currentBranch}
          </span>
        </span>
      </header>

      <div className="flex items-center gap-5 px-10 py-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-divider)] flex-shrink-0">
        <span className="font-mono text-base uppercase tracking-[0.22em] text-[var(--color-accent)] font-bold whitespace-nowrap">
          Paso {Math.min(preloadedIndex + 1, PRELOADED_COMMANDS.length)} / {PRELOADED_COMMANDS.length}
        </span>
        <span className="text-xl text-[var(--color-text-primary)] leading-snug">
          {STEP_EXPLANATIONS[Math.min(preloadedIndex, STEP_EXPLANATIONS.length - 1)]}
        </span>
      </div>

      <Terminal
        onExecute={handleExecute}
        history={state.terminalHistory}
        preloadedCommand={currentPreloadedCommand}
        className="border-b border-[var(--color-divider)] h-[38vh] flex-shrink-0"
      />

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 bg-[var(--color-bg-primary)] flex items-center justify-center">
          <GitVisualization state={state} className="w-full h-full px-4 py-2" />
        </div>
        <PRStatusPanel
          filesChanged={state.filesChanged}
          status={state.prStatus}
          className="w-[360px] border-l border-[var(--color-divider)] flex-shrink-0"
        />
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
