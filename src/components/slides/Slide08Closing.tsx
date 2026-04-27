"use client";

import { motion } from "motion/react";

const titleWords = ["UN PR", "/ NO ES SOLO", "/ GIT."];

const chips = [
  { label: "Identificación", from: { x: -200, y: 0 } },
  { label: "Control", from: { x: 200, y: 0 } },
  { label: "Auditoría", from: { x: 0, y: -200 } },
  { label: "Contabilidad", from: { x: 0, y: 200 } },
];

export default function Slide08Closing() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 py-24 flex flex-col justify-center">
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]"
      >
        Cierre · PR = GCS Aplicada
      </motion.span>

      <h2 className="mt-8 font-black leading-[0.9] tracking-[-0.04em] text-[clamp(72px,9vw,128px)] flex flex-col">
        {titleWords.map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2 + i * 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className={
              i === titleWords.length - 1
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-text-primary)]"
            }
          >
            {word}
          </motion.span>
        ))}
      </h2>

      <div className="mt-12 flex flex-wrap gap-3">
        {chips.map((chip, i) => (
          <motion.span
            key={chip.label}
            initial={{ opacity: 0, x: chip.from.x, y: chip.from.y }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 1.0 + i * 0.08,
            }}
            className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-md uppercase tracking-[0.18em] text-sm font-medium"
          >
            [ {chip.label} ]
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="mt-10 max-w-3xl text-2xl text-[var(--color-text-secondary)] leading-snug"
      >
        Es la forma moderna de aplicar las{" "}
        <span className="text-[var(--color-text-primary)] font-medium">
          4 actividades de la GCS
        </span>
        .
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.8 }}
        className="mt-6 max-w-2xl text-base text-[var(--color-text-secondary)] italic"
      >
        El viernes deployás. El lunes dormís tranquilo.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.0 }}
        className="absolute bottom-12 left-20 right-20 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]"
      >
        <span>Matías González · Cátedra GCS</span>
        <span>github.com/deploy-en-viernes</span>
        <span>Pull Request II → próxima clase</span>
      </motion.div>
    </section>
  );
}
