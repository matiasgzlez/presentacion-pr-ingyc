"use client";

import { motion } from "motion/react";

const moments = [
  {
    time: "17:58",
    action: "git push origin main (sin PR, 5 commits)",
    consequence: "Commits sueltos sin nombre: ¿cuál es la feature, cuál el fix?",
    failed: "Identificación",
  },
  {
    time: "18:03",
    action: "Tests rotos en prod",
    consequence: "Nadie validó el cambio antes de que llegara a main",
    failed: "Control",
  },
  {
    time: "18:15",
    action: 'Commit message: "fix"',
    consequence: "Hay autor y fecha, pero ni un porqué ni un revisor",
    failed: "Auditoría",
  },
  {
    time: "18:20",
    action: "El Product Manager pregunta: ¿qué se deployó hoy?",
    consequence: "Solo hay un git log. No hay registro de qué se aprobó ni por qué",
    failed: "Contabilidad",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.4, staggerChildren: 0.18 },
  },
};

const rowVariants = {
  hidden: { x: -40, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function Slide02Problem() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-dark)] text-white overflow-hidden flex flex-col">
      <div className="px-20 pt-14 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-xl uppercase tracking-[0.22em] text-white/50 leading-relaxed"
        >
          <span className="text-[var(--color-accent)]">Equipo de 5 devs</span>
          {" · "}
          <span>Single repo en GitHub</span>
          {" · "}
          <span>Deploy directo a main</span>
          {" · "}
          <span className="text-white/30">Sin code review</span>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="px-20 font-black text-6xl md:text-7xl leading-[1.0] tracking-[-0.02em] mb-10"
      >
        Viernes 17:58. Las 4 actividades de la GCS{" "}
        <span className="text-[var(--color-accent)]">se rompen a la vez.</span>
      </motion.h2>

      <motion.ol
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-20 flex flex-col"
      >
        {moments.map((m, i) => (
          <motion.li
            key={m.time}
            variants={rowVariants}
            className="flex-1 grid grid-cols-12 items-center gap-8 border-t border-white/10"
            style={i === moments.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.1)" } : undefined}
          >
            <span className="col-span-2 font-mono text-5xl font-bold text-[var(--color-accent)]">
              {m.time}
            </span>
            <div className="col-span-7 flex flex-col gap-1">
              <span className="font-mono text-3xl font-bold text-white leading-tight">
                {m.action}
              </span>
              <span className="text-2xl text-white/60 leading-snug">
                {m.consequence}
              </span>
            </div>
            <div className="col-span-3 flex justify-end">
              <span className="border border-[var(--color-accent)] text-[var(--color-accent)] px-5 py-2 rounded-md uppercase tracking-[0.18em] text-lg font-bold">
                ✗ {m.failed}
              </span>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
