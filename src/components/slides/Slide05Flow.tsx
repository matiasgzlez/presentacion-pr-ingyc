"use client";

import { motion } from "motion/react";
import { useTypewriter } from "@/hooks/useTypewriter";

const steps = [
  { num: "01", title: "Crear feature branch", hint: "git checkout -b" },
  { num: "02", title: "Commit + push al remote", hint: "git commit · git push" },
  { num: "03", title: "Abrir PR en la plataforma", hint: "GitHub · GitLab · Bitbucket" },
];

interface TerminalLine {
  prompt?: string;
  text: string;
  output?: boolean;
  highlight?: boolean;
  delay: number;
}

const lines: TerminalLine[] = [
  { prompt: "$", text: 'git checkout -b "featureX"', delay: 400 },
  { text: "Switched to a new branch 'featureX'", output: true, delay: 1500 },
  { prompt: "$", text: 'git commit -m "added featureX"', delay: 2200 },
  { text: "[featureX 52c3153] added featureX", output: true, delay: 3500 },
  { prompt: "$", text: "git push --set-upstream origin featureX", delay: 4200 },
  { text: "remote: Create pull request for featureX:", output: true, delay: 5800 },
  {
    text: "remote: https://bitbucket.org/me/repo/pull-requests/new",
    output: true,
    highlight: true,
    delay: 6400,
  },
];

function TerminalLine({ line }: { line: TerminalLine }) {
  const { output: typed, done } = useTypewriter(line.text, {
    speed: line.output ? 12 : 35,
    delay: line.delay,
  });

  return (
    <div className="flex gap-3 leading-relaxed">
      {line.prompt && (
        <span className="text-[var(--color-accent)] select-none">
          {line.prompt}
        </span>
      )}
      <span
        className={
          line.highlight
            ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-2 -mx-2 rounded animate-pulse"
            : line.output
              ? "text-white/60"
              : "text-white"
        }
      >
        {typed}
        {!done && typed.length > 0 && (
          <span className="inline-block w-[6px] h-[1em] -mb-[2px] ml-0.5 bg-white/70 align-middle" />
        )}
      </span>
    </div>
  );
}

export default function Slide05Flow() {
  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 pt-14 pb-12 flex flex-col">
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xl uppercase tracking-[0.22em] text-[var(--color-accent)]"
      >
        <span className="text-[var(--color-text-secondary)]">¿Cómo se construye ese arco?</span>{" "}
        <span className="text-[var(--color-accent)]">feature/login → main</span>
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="mt-4 font-black leading-[0.95] tracking-[-0.03em] text-6xl md:text-7xl"
      >
        Así nace un PR.{" "}
        <span className="text-[var(--color-accent)]">3 comandos.</span>
      </motion.h2>

      <div className="grid grid-cols-12 gap-10 w-full mt-12 flex-1 items-center">
        <div className="col-span-5 flex flex-col">
          <ul className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                className="flex items-baseline gap-6"
              >
                <span className="font-black text-[120px] leading-none text-[var(--color-accent)] tracking-[-0.04em]">
                  {step.num}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="font-black text-3xl tracking-tight leading-tight">
                    {step.title}
                  </span>
                  <span className="font-mono text-lg uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    {step.hint}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-7 rounded-lg bg-[var(--color-bg-dark)] p-10 font-mono text-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-2 mb-8">
            <span className="w-4 h-4 rounded-full bg-white/15" />
            <span className="w-4 h-4 rounded-full bg-white/15" />
            <span className="w-4 h-4 rounded-full bg-white/15" />
            <span className="ml-5 font-mono text-base uppercase tracking-[0.22em] text-white/40">
              ~/repo · main → featureX
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {lines.map((line, idx) => (
              <TerminalLine key={idx} line={line} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
