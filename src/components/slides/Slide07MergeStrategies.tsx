"use client";

import { motion } from "motion/react";

function MergeCommitDiagram() {
  return (
    <svg
      viewBox="0 0 200 110"
      className="w-full h-32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      {/* main line */}
      <line x1="20" y1="55" x2="180" y2="55" className="text-[var(--color-divider)]" />

      {/* branch curve */}
      <motion.path
        d="M60,55 C75,55 75,25 95,25 L130,25 C150,25 150,55 165,55"
        className="text-[var(--color-accent)]"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.5 }}
      />

      {/* commits on main */}
      {[40, 80, 130].map((cx) => (
        <circle key={cx} cx={cx} cy="55" r="5" className="text-[var(--color-text-primary)] fill-current" />
      ))}

      {/* branch commits */}
      {[100, 125].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="25"
          r="5"
          className="text-[var(--color-accent)] fill-current"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.2, repeat: Infinity, repeatDelay: 2.5 }}
        />
      ))}

      {/* merge commit (new) */}
      <motion.circle
        cx="165"
        cy="55"
        r="7"
        className="text-[var(--color-merged)] fill-current"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ duration: 0.6, delay: 1.6, repeat: Infinity, repeatDelay: 2.4 }}
      />
    </svg>
  );
}

function SquashDiagram() {
  return (
    <svg
      viewBox="0 0 200 110"
      className="w-full h-32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      {/* main line */}
      <line x1="20" y1="55" x2="180" y2="55" className="text-[var(--color-divider)]" />

      {/* incoming branch with multiple commits collapsing */}
      <motion.path
        d="M70,55 C85,55 85,25 105,25 L140,25"
        className="text-[var(--color-accent)]"
        initial={{ pathLength: 1, opacity: 1 }}
        animate={{ pathLength: [1, 1, 0.4], opacity: [1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.55, 1], repeat: Infinity, ease: "easeInOut" }}
      />

      {/* multiple branch commits collapsing */}
      {[100, 120, 140].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="25"
          r="5"
          className="text-[var(--color-accent)] fill-current"
          initial={{ scale: 0, x: 0 }}
          animate={{
            scale: [0, 1, 1, 0],
            x: [0, 0, 0, 165 - cx],
            y: [0, 0, 0, 30],
          }}
          transition={{
            duration: 3,
            times: [0, 0.25, 0.55, 1],
            repeat: Infinity,
            delay: i * 0.05,
          }}
        />
      ))}

      {/* commits on main */}
      {[40, 80, 130].map((cx) => (
        <circle key={cx} cx={cx} cy="55" r="5" className="text-[var(--color-text-primary)] fill-current" />
      ))}

      {/* squash result */}
      <motion.circle
        cx="165"
        cy="55"
        r="7"
        className="text-[var(--color-success)] fill-current"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 0, 1.4, 1] }}
        transition={{ duration: 3, times: [0, 0.55, 0.7, 0.85], repeat: Infinity }}
      />
    </svg>
  );
}

interface Strategy {
  badge: string;
  title: string;
  command: string;
  description: string;
  diagram: React.ReactNode;
}

const strategies: Strategy[] = [
  {
    badge: "Estrategia A",
    title: "Merge Commit",
    command: "git merge --no-ff",
    description:
      "Preserva la historia completa de la branch. Trazabilidad total: cada commit del feature queda visible.",
    diagram: <MergeCommitDiagram />,
  },
  {
    badge: "Estrategia B",
    title: "Squash",
    command: "git merge --squash",
    description:
      "Fusiona todos los commits en uno solo. Historial lineal y limpio, ideal para changelogs ordenados.",
    diagram: <SquashDiagram />,
  },
];

export default function Slide07MergeStrategies() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 py-24 flex flex-col justify-center">
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]"
      >
        Review · Cierre del PR
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-6 font-black text-7xl tracking-[-0.03em] leading-[0.95]"
      >
        REVIEW Y MERGE
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-4 text-2xl text-[var(--color-text-secondary)]"
      >
        Lo que hicimos en la demo, formalizado.
      </motion.p>

      <div className="mt-16 grid grid-cols-2 gap-8">
        {strategies.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
            className="rounded-xl border border-[var(--color-divider)] p-8 hover:border-[var(--color-accent)] transition-colors"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">
                {s.badge}
              </span>
              <code className="font-mono text-sm text-[var(--color-accent)]">
                {s.command}
              </code>
            </div>

            <h3 className="mt-4 font-black text-3xl uppercase tracking-tight">
              {s.title}
            </h3>

            <div className="mt-6">{s.diagram}</div>

            <p className="mt-6 text-base text-[var(--color-text-secondary)] leading-relaxed">
              {s.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
