"use client";

import { motion } from "motion/react";

const moments = [
  {
    num: "01",
    when: "Al crear la rama",
    tag: "Draft PR",
    tagAccent: true,
    description:
      "Abrís el PR desde el inicio, antes de tener el código listo. A esto se lo llama draft pull request (PR en borrador). Anunciás al equipo en qué estás trabajando y permitís el seguimiento desde el principio.",
  },
  {
    num: "02",
    when: "Cuando querés feedback",
    tag: "En progreso",
    tagAccent: false,
    description:
      "Abrís el PR para pedir retroalimentación temprana. El equipo puede ver tu avance, hacer sugerencias y señalar problemas antes de que termines.",
  },
  {
    num: "03",
    when: "Cuando está lista para merge",
    tag: "Listo",
    tagAccent: false,
    description:
      "El caso más tradicional: terminaste el trabajo, querés una revisión formal y que los cambios se integren al proyecto principal.",
  },
];

const container = {
  hidden: {},
  show: { transition: { delayChildren: 0.4, staggerChildren: 0.13 } },
};

const item = {
  hidden: { y: 32, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function SlideWhenToOpen() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 pt-14 pb-12 flex flex-col">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xl uppercase tracking-[0.22em] text-[var(--color-text-secondary)]"
      >
        ¿Cuándo abrirlo?
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
        className="mt-4 font-black leading-[0.88] tracking-[-0.04em] text-[clamp(40px,5vw,68px)]"
      >
        WHEN DO YOU OPEN{" "}
        <span className="text-[var(--color-accent)]">A PULL REQUEST?</span>
      </motion.h2>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-auto grid grid-cols-3 gap-6"
      >
        {moments.map(({ num, when, tag, tagAccent, description }) => (
          <motion.div
            key={num}
            variants={item}
            className="rounded-xl border border-[var(--color-divider)] p-8 bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] transition-colors flex flex-col gap-5"
          >
            {/* Number + tag row */}
            <div className="flex items-center justify-between">
              <span className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-black text-xl leading-none tracking-tighter">
                {num}
              </span>
              <span
                className={`font-mono text-xs font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-md ${
                  tagAccent
                    ? "bg-[var(--color-accent)] text-white"
                    : "border border-[var(--color-divider)] text-[var(--color-text-secondary)]"
                }`}
              >
                {tag}
              </span>
            </div>

            {/* When */}
            <h3 className="font-black text-3xl uppercase tracking-tight leading-none">
              {when}
            </h3>

            {/* Description */}
            <p className="text-2xl text-[var(--color-text-secondary)] leading-snug">
              {description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 border-l-4 border-[var(--color-accent)] pl-8 py-2"
      >
        <p className="text-2xl text-[var(--color-text-secondary)] leading-snug max-w-5xl">
          No hay un único momento correcto —{" "}
          <span className="text-[var(--color-text-primary)] font-bold">
            podés abrirlo al principio, en el medio o al final
          </span>
          , según lo que necesités del equipo.
        </p>
      </motion.div>
    </section>
  );
}
