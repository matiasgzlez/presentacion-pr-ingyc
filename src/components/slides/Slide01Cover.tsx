"use client";

import { motion } from "motion/react";

export default function Slide01Cover() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden">
      <div className="absolute top-20 left-20 right-20">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]"
        >
          Deploy en Viernes · Unidad II · GCS
        </motion.span>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="relative w-full pl-20 pr-0">
          <h1 className="font-black leading-[0.85] tracking-[-0.04em] flex flex-col">
            <motion.span
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="text-[clamp(120px,15vw,220px)] text-[var(--color-text-primary)]"
            >
              PULL
            </motion.span>
            <motion.span
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="text-[clamp(120px,15vw,220px)] -mt-[0.06em] text-transparent [-webkit-text-stroke:2px_#0A0A0A]"
            >
              REQUEST
            </motion.span>
          </h1>

          <motion.span
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 8, delay: 0.5 }}
            className="absolute right-12 top-1/2 -translate-y-1/2 font-black leading-none text-[clamp(220px,32vw,520px)] text-[var(--color-accent)]"
          >
            I
          </motion.span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-32 left-20 right-20 max-w-3xl text-2xl text-[var(--color-text-secondary)] leading-snug"
      >
        Son las 17:58 de un viernes. Tu compañero pusheó directo a master.{" "}
        <span className="text-[var(--color-text-primary)] font-medium">
          ¿Qué hacés?
        </span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="absolute bottom-12 left-20 right-20 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]"
      >
        <span>Matías González</span>
        <span>2026 · Cátedra GCS</span>
        <span>Single Repository · Parte I</span>
      </motion.div>
    </section>
  );
}
