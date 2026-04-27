"use client";

import { motion } from "motion/react";
import { GitMerge, MessageSquare, CheckCircle2, type LucideIcon } from "lucide-react";

interface Card {
  icon: LucideIcon;
  title: string;
  description: string;
}

const cards: Card[] = [
  {
    icon: GitMerge,
    title: "Mergear",
    description: "Integrar una rama al proyecto principal.",
  },
  {
    icon: MessageSquare,
    title: "Comunicar",
    description: "Comentarios y discusión técnica del equipo.",
  },
  {
    icon: CheckCircle2,
    title: "Aprobar",
    description: "Code review formal antes del merge.",
  },
];

const container = {
  hidden: {},
  show: { transition: { delayChildren: 0.3, staggerChildren: 0.15 } },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function Slide03WhatIsPR() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 py-24 flex flex-col justify-center">
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)] mb-6"
      >
        Definición · Pull Request
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="font-black leading-[0.85] tracking-[-0.04em] text-[clamp(96px,12vw,160px)]"
      >
        ¿QUÉ ES{" "}
        <span className="text-[var(--color-accent)]">/</span> UN PR?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 max-w-3xl text-2xl text-[var(--color-text-secondary)] leading-snug"
      >
        Una feature de los hostings de Git que convierte un cambio de código en
        una conversación auditada.
      </motion.p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-16 grid grid-cols-3 gap-6"
      >
        {cards.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            variants={item}
            className="rounded-xl border border-[var(--color-divider)] p-8 bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] transition-colors"
          >
            <div className="w-12 h-12 bg-[var(--color-accent)] flex items-center justify-center">
              <Icon className="text-white" strokeWidth={1.5} size={24} />
            </div>
            <h3 className="mt-6 font-black text-2xl uppercase tracking-tight">
              {title}
            </h3>
            <p className="mt-3 text-base text-[var(--color-text-secondary)] leading-relaxed">
              {description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
