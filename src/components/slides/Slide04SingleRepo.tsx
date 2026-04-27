"use client";

import { motion } from "motion/react";
import SingleRepoDiagram from "./SingleRepoDiagram";

export default function Slide04SingleRepo() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] overflow-hidden px-20 py-20 flex flex-col">
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]"
      >
        Single Repository
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="mt-6 font-black leading-[0.95] tracking-[-0.03em] text-5xl md:text-6xl max-w-5xl"
      >
        Un solo repo. Múltiples branches.{" "}
        <span className="text-[var(--color-accent)]">Una fuente de verdad.</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex-1 flex items-center justify-center mt-4"
      >
        <div className="w-full max-w-6xl">
          <SingleRepoDiagram />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.2 }}
        className="text-center text-sm font-mono text-[var(--color-text-secondary)]"
      >
        pasá el cursor sobre cada branch →
      </motion.p>
    </section>
  );
}
