"use client";

import { motion } from "motion/react";

const solutions = [
  {
    activity: "Identificación",
    answer: "El PR agrupa los commits bajo un título, descripción y número (#142).",
  },
  {
    activity: "Control",
    answer: "CI corre los tests automáticamente antes de habilitar el merge.",
  },
  {
    activity: "Auditoría",
    answer: "Conversación, revisores y aprobaciones quedan registrados para siempre.",
  },
  {
    activity: "Contabilidad",
    answer: "Cada PR es una entrada en el libro de cambios del proyecto.",
  },
];

const container = {
  hidden: {},
  show: { transition: { delayChildren: 0.5, staggerChildren: 0.12 } },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function Slide03WhatIsPR() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 pt-14 pb-12 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xl uppercase tracking-[0.22em] flex items-center gap-4"
      >
        <span className="text-white bg-[var(--color-bg-dark)] px-4 py-2 rounded">
          ✗ Sin PR
        </span>
        <span className="text-[var(--color-text-secondary)] text-2xl">→</span>
        <span className="text-white bg-[var(--color-accent)] px-4 py-2 rounded">
          ✓ Con PR
        </span>
        <span className="ml-6 text-[var(--color-text-secondary)] tracking-[0.18em]">
          Las mismas 4 actividades, una sola herramienta
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="mt-8 font-black leading-[0.85] tracking-[-0.04em] text-[clamp(96px,12vw,160px)]"
      >
        PULL <span className="text-[var(--color-accent)]">REQUEST</span>
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-auto grid grid-cols-4 gap-6"
      >
        {solutions.map(({ activity, answer }) => (
          <motion.div
            key={activity}
            variants={item}
            className="rounded-xl border border-[var(--color-divider)] p-8 bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] transition-colors flex flex-col gap-5"
          >
            <div className="flex flex-col gap-4">
              <span className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-black text-3xl leading-none">
                ✓
              </span>
              <h3 className="font-black text-3xl uppercase tracking-tight leading-none">
                {activity}
              </h3>
            </div>
            <p className="text-2xl text-[var(--color-text-secondary)] leading-snug">
              {answer}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
