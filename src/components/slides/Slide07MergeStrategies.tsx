"use client";

import { motion } from "motion/react";

function MergeCommitDiagram() {
  return (
    <svg
      viewBox="0 0 200 110"
      className="w-full h-48"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    >
      {/* main line */}
      <line x1="20" y1="60" x2="180" y2="60" className="text-[var(--color-divider)]" />

      {/* branch curve */}
      <motion.path
        d="M60,60 C75,60 75,25 95,25 L130,25 C150,25 150,60 165,60"
        className="text-[var(--color-accent)]"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.5 }}
      />

      {/* commits on main */}
      {[40, 80, 130].map((cx) => (
        <circle key={cx} cx={cx} cy="60" r="8" className="text-[var(--color-text-primary)] fill-current" />
      ))}

      {/* branch commits */}
      {[100, 125].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="25"
          r="8"
          className="text-[var(--color-accent)] fill-current"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.2, repeat: Infinity, repeatDelay: 2.5 }}
        />
      ))}

      {/* merge commit (new) */}
      <motion.circle
        cx="165"
        cy="60"
        r="11"
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
      className="w-full h-48"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    >
      {/* main line */}
      <line x1="20" y1="60" x2="180" y2="60" className="text-[var(--color-divider)]" />

      {/* incoming branch with multiple commits collapsing */}
      <motion.path
        d="M70,60 C85,60 85,25 105,25 L140,25"
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
          r="8"
          className="text-[var(--color-accent)] fill-current"
          initial={{ scale: 0, x: 0 }}
          animate={{
            scale: [0, 1, 1, 0],
            x: [0, 0, 0, 165 - cx],
            y: [0, 0, 0, 35],
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
        <circle key={cx} cx={cx} cy="60" r="8" className="text-[var(--color-text-primary)] fill-current" />
      ))}

      {/* squash result */}
      <motion.circle
        cx="165"
        cy="60"
        r="11"
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
    badge: "Opción A · Conserva todo",
    title: "Merge Commit",
    command: "git merge --no-ff",
    description:
      "Guarda cada paso del trabajo. Mañana podés ver exactamente quién cambió qué y cuándo, como un diario detallado.",
    diagram: <MergeCommitDiagram />,
  },
  {
    badge: "Opción B · Resume en uno",
    title: "Squash",
    command: "git merge --squash",
    description:
      "Junta todos los pasos en un solo cambio. El historial queda más corto y fácil de leer: una entrada por feature.",
    diagram: <SquashDiagram />,
  },
];

export default function Slide07MergeStrategies() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 pt-14 pb-12 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xl uppercase tracking-[0.22em]"
      >
        <span className="text-[var(--color-text-secondary)]">Cuando aceptás un PR · </span>
        <span className="text-[var(--color-accent)]">tenés que elegir cómo guardarlo</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="mt-4 font-black leading-[0.95] tracking-[-0.03em] text-6xl md:text-7xl"
      >
        ¿Guardamos cada paso{" "}
        <span className="text-[var(--color-accent)]">o solo el resultado?</span>
      </motion.h2>

      <div className="mt-auto grid grid-cols-2 gap-8">
        {strategies.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
            className="rounded-xl border border-[var(--color-divider)] p-8 hover:border-[var(--color-accent)] transition-colors flex flex-col gap-5"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-base uppercase tracking-[0.22em] text-[var(--color-text-secondary)] font-bold">
                {s.badge}
              </span>
              <code className="font-mono text-xl text-[var(--color-accent)] font-bold">
                {s.command}
              </code>
            </div>

            <h3 className="font-black text-5xl uppercase tracking-tight leading-none">
              {s.title}
            </h3>

            <div>{s.diagram}</div>

            <p className="text-2xl text-[var(--color-text-secondary)] leading-snug">
              {s.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
