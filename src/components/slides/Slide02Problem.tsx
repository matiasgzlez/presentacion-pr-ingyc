"use client";

import { motion } from "motion/react";

const chips = [
  "Identificación",
  "Control",
  "Auditoría",
  "Contabilidad del estado",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.3, staggerChildren: 0.1 },
  },
};

const chipVariants = {
  hidden: { x: 50, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function Slide02Problem() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-dark)] text-white overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-12 gap-12 px-20 py-24">
        <div className="col-span-7 flex flex-col justify-center gap-8">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]"
          >
            El Problema
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="font-black text-5xl md:text-6xl leading-[1.05] tracking-[-0.02em] max-w-2xl"
          >
            Sin revisión, sin trazabilidad,{" "}
            <span className="text-[var(--color-accent)]">sin marcha atrás.</span>
          </motion.h2>
        </div>

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="col-span-5 flex flex-col justify-center gap-4"
        >
          {chips.map((chip) => (
            <motion.li
              key={chip}
              variants={chipVariants}
              className="border border-[var(--color-accent)] text-[var(--color-accent)] px-6 py-3 rounded-md uppercase tracking-[0.18em] text-sm font-medium w-fit"
            >
              [ {chip} ]
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-12 left-20 right-20 text-sm md:text-base text-white/60 max-w-3xl"
      >
        Las 4 actividades de la GCS que un PR resuelve en una sola interfaz.
      </motion.p>
    </section>
  );
}
