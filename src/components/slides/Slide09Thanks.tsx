"use client";

import { motion } from "motion/react";

const lines = [
  { text: "Hacés un", accent: false },
  { text: "DEPLOY EN VIERNES", accent: true },
  { text: "y el finde descansás.", accent: false },
];

function CurtainLine({
  text,
  accent,
  wordOffset,
  className,
}: {
  text: string;
  accent: boolean;
  wordOffset: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap gap-x-8 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.6,
              delay: (wordOffset + i) * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={`inline-block font-black leading-none tracking-normal text-[clamp(48px,6.5vw,100px)] ${
              accent ? "text-[var(--color-accent)]" : "text-white"
            }`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export default function Slide09Thanks() {
  // Compute cumulative word offsets so stagger is continuous across all lines
  const wordCounts = lines.map((l) => l.text.split(" ").length);
  const offsets = wordCounts.reduce<number[]>((acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + wordCounts[i - 1]);
    return acc;
  }, []);

  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  const thanksDelay = totalWords * 0.1 + 0.2;

  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-dark)] text-white overflow-hidden flex flex-col items-center justify-center px-20">
      {/* Main phrase */}
      <div className="flex flex-col gap-3">
        {lines.map((line, i) => (
          <CurtainLine
            key={i}
            text={line.text}
            accent={line.accent}
            wordOffset={offsets[i]}
          />
        ))}
      </div>

      {/* Muchas gracias — curtain reveal letra por letra */}
      <div className="mt-10 flex">
        {"Muchas gracias.".split("").map((char, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.5,
                delay: thanksDelay + i * 0.04,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="inline-block font-black uppercase tracking-[0.05em] text-4xl text-white/60"
            >
              {char === " " ? " " : char}
            </motion.span>
          </span>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: thanksDelay + 0.8 }}
        className="absolute bottom-10 left-20 right-20 flex items-center justify-between font-mono text-base uppercase tracking-[0.22em] text-white/30"
      >
        <span>Deploy en Viernes · Unidad II · GCS</span>
        <span>Pull Request · Parte I</span>
      </motion.div>
    </section>
  );
}
