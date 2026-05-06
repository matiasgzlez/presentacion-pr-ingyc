"use client";

import { useState } from "react";
import { motion } from "motion/react";

const LOOP = { repeat: Infinity, repeatType: "loop" as const };

function SingleRepoDiagram() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" fill="none" strokeLinecap="round">
      {/* Main branch line */}
      <line x1="20" y1="130" x2="380" y2="130" stroke="rgba(255,255,255,0.55)" strokeWidth="6" />

      {/* Feature branch path */}
      <motion.path
        d="M 90,130 C 120,130 120,55 150,55 L 260,55 C 290,55 290,130 320,130"
        stroke="#FF6B35"
        strokeWidth="6"
        style={{ filter: "drop-shadow(0 0 10px #FF6B35)" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.8, times: [0, 0.45, 0.82, 1], ...LOOP, repeatDelay: 0.5, ease: "easeInOut" }}
      />

      {/* Static main commits */}
      <circle cx="45" cy="130" r="12" fill="rgba(255,255,255,0.85)" />
      <circle cx="360" cy="130" r="12" fill="rgba(255,255,255,0.85)" />

      {/* Branch-off point */}
      <circle cx="90" cy="130" r="12" fill="#FFFFFF" />

      {/* Feature commits */}
      {([178, 232] as number[]).map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="55"
          r="13"
          fill="#FF6B35"
          style={{ filter: "drop-shadow(0 0 12px #FF6B35)" }}
          animate={{ scale: [0, 0, 1.3, 1, 1, 0] }}
          transition={{
            duration: 2.8,
            times: [0, 0.16 + i * 0.1, 0.3 + i * 0.1, 0.42 + i * 0.06, 0.82, 1],
            ...LOOP,
            repeatDelay: 0.5,
          }}
        />
      ))}

      {/* Merge commit */}
      <motion.circle
        cx="320"
        cy="130"
        r="18"
        fill="#6B3FA0"
        style={{ filter: "drop-shadow(0 0 16px #6B3FA0)" }}
        animate={{ scale: [0, 0, 0, 1.5, 1, 1, 0] }}
        transition={{
          duration: 2.8,
          times: [0, 0.42, 0.52, 0.62, 0.7, 0.82, 1],
          ...LOOP,
          repeatDelay: 0.5,
        }}
      />

      {/* PR badge */}
      <motion.g
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 2.8, times: [0, 0.26, 0.4, 0.8, 1], ...LOOP, repeatDelay: 0.5 }}
      >
        <rect x="163" y="22" width="84" height="22" rx="5" fill="rgba(255,107,53,0.2)" />
        <text
          x="205"
          y="38"
          textAnchor="middle"
          fontSize="13"
          fontFamily="monospace"
          fill="#FF6B35"
          fontWeight="bold"
          letterSpacing="0.1em"
        >
          PR #142
        </text>
      </motion.g>

      {/* Branch label */}
      <text
        x="200"
        y="180"
        textAnchor="middle"
        fontSize="12"
        fontFamily="monospace"
        fill="rgba(255,255,255,0.28)"
        letterSpacing="0.12em"
      >
        feature/login → main
      </text>
    </svg>
  );
}

function MultiRepoDiagram() {
  const LINE_Y = 95;

  return (
    <svg viewBox="0 0 400 200" className="w-full h-full" fill="none" strokeLinecap="round">
      {/* Fork box */}
      <rect
        x="12"
        y="30"
        width="148"
        height="108"
        rx="12"
        stroke="#FF6B35"
        strokeWidth="3.5"
        fill="rgba(255,107,53,0.08)"
      />

      {/* Fork branch line */}
      <line x1="32" y1={LINE_Y} x2="144" y2={LINE_Y} stroke="rgba(255,107,53,0.75)" strokeWidth="5" />

      {/* Fork commits */}
      <circle cx="55" cy={LINE_Y} r="11" fill="rgba(255,107,53,0.8)" />
      <circle cx="92" cy={LINE_Y} r="11" fill="rgba(255,107,53,0.8)" />
      <circle
        cx="129"
        cy={LINE_Y}
        r="11"
        fill="#FF6B35"
        style={{ filter: "drop-shadow(0 0 8px #FF6B35)" }}
      />

      {/* Fork label */}
      <text
        x="86"
        y="19"
        textAnchor="middle"
        fontSize="18"
        fontFamily="monospace"
        fill="#FF6B35"
        fontWeight="bold"
        letterSpacing="0.12em"
      >
        FORK
      </text>

      {/* Fork sublabel */}
      <text
        x="86"
        y="160"
        textAnchor="middle"
        fontSize="14"
        fontFamily="monospace"
        fill="rgba(255,107,53,0.85)"
        letterSpacing="0.08em"
      >
        copia personal
      </text>

      {/* Upstream box */}
      <rect
        x="240"
        y="30"
        width="148"
        height="108"
        rx="12"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="3.5"
        fill="rgba(255,255,255,0.06)"
      />

      {/* Upstream branch line */}
      <line x1="260" y1={LINE_Y} x2="372" y2={LINE_Y} stroke="rgba(255,255,255,0.6)" strokeWidth="5" />

      {/* Upstream commits */}
      <circle cx="283" cy={LINE_Y} r="11" fill="rgba(255,255,255,0.7)" />
      <circle cx="320" cy={LINE_Y} r="11" fill="rgba(255,255,255,0.7)" />

      {/* Upstream label */}
      <text
        x="314"
        y="19"
        textAnchor="middle"
        fontSize="18"
        fontFamily="monospace"
        fill="rgba(255,255,255,0.9)"
        fontWeight="bold"
        letterSpacing="0.12em"
      >
        UPSTREAM
      </text>

      {/* Upstream sublabel */}
      <text
        x="314"
        y="160"
        textAnchor="middle"
        fontSize="14"
        fontFamily="monospace"
        fill="rgba(255,255,255,0.7)"
        letterSpacing="0.08em"
      >
        repositorio original
      </text>

      {/* PR dashed arrow */}
      <motion.path
        d="M 160,95 L 240,95"
        stroke="#FF6B35"
        strokeWidth="4.5"
        strokeDasharray="7 4"
        style={{ filter: "drop-shadow(0 0 7px #FF6B35)" }}
        animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.2,
          times: [0, 0.32, 0.58, 0.72],
          ...LOOP,
          repeatDelay: 0.3,
          ease: "easeInOut",
        }}
      />

      {/* Arrowhead */}
      <motion.path
        d="M 230,85 L 240,95 L 230,105"
        stroke="#FF6B35"
        strokeWidth="4.5"
        style={{ filter: "drop-shadow(0 0 7px #FF6B35)" }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: 3.2,
          times: [0, 0.3, 0.36, 0.58, 0.72],
          ...LOOP,
          repeatDelay: 0.3,
        }}
      />

      {/* Traveling dot */}
      <motion.circle
        cx="160"
        cy={LINE_Y}
        r="9"
        fill="#FF6B35"
        style={{ filter: "drop-shadow(0 0 14px #FF6B35)" }}
        animate={{ x: [0, 0, 80, 80], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.2,
          times: [0, 0.06, 0.35, 0.42],
          ...LOOP,
          repeatDelay: 0.3,
          ease: "easeInOut",
        }}
      />

      {/* PR label */}
      <motion.g
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: 3.2,
          times: [0, 0.08, 0.22, 0.58, 0.72],
          ...LOOP,
          repeatDelay: 0.3,
        }}
      >
        <rect x="174" y="74" width="52" height="20" rx="4" fill="rgba(255,107,53,0.2)" />
        <text
          x="200"
          y="88"
          textAnchor="middle"
          fontSize="12"
          fontFamily="monospace"
          fill="#FF6B35"
          fontWeight="bold"
          letterSpacing="0.12em"
        >
          PR
        </text>
      </motion.g>

      {/* Merge commit in upstream */}
      <motion.circle
        cx="357"
        cy={LINE_Y}
        r="14"
        fill="#6B3FA0"
        style={{ filter: "drop-shadow(0 0 14px #6B3FA0)" }}
        animate={{ scale: [0, 0, 0, 1.5, 1, 1, 0] }}
        transition={{
          duration: 3.2,
          times: [0, 0.35, 0.5, 0.6, 0.68, 0.82, 1],
          ...LOOP,
          repeatDelay: 0.3,
        }}
      />
    </svg>
  );
}

const configs = [
  {
    num: "01",
    label: "Single Repository",
    subtitle: "Un repositorio · Múltiples ramas",
    description:
      "El PR va de una rama al main dentro del mismo repo. Todo el equipo tiene permisos de escritura.",
    diagram: <SingleRepoDiagram />,
    accent: true,
    badge: "Esta presentación",
    dim: false,
  },
  {
    num: "02",
    label: "Multi-Repository",
    subtitle: "Fork · Upstream",
    description:
      "El PR va desde tu fork hacia el upstream original. Típico en proyectos open source.",
    diagram: <MultiRepoDiagram />,
    accent: false,
    badge: "Más adelante",
    dim: true,
  },
];

export default function SlideRepoConfigs() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-screen h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden px-20 pt-10 pb-8 flex flex-col">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-xl uppercase tracking-[0.22em] text-[var(--color-text-secondary)] flex-shrink-0"
      >
        Dos configuraciones de repositorios
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 mt-2 font-black tracking-[-0.03em] leading-none text-[clamp(36px,4.5vw,60px)]"
      >
        TWO REPOSITORY{" "}
        <span className="text-[var(--color-accent)]">CONFIGURATIONS</span>
      </motion.h2>

      {/* Cards — take all remaining space */}
      <div className="mt-5 grid grid-cols-2 gap-6 flex-1 min-h-0">
        {configs.map(({ num, label, subtitle, description, diagram, accent, badge, dim }, i) => (
          <motion.div
            key={num}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            initial={{ opacity: 0, y: 28 }}
            animate={{
              opacity: hoveredIndex === null
                ? (dim ? 0.42 : 1)
                : (hoveredIndex === i ? 1 : 0.42),
              y: 0,
            }}
            transition={{
              opacity: { duration: hoveredIndex !== null ? 0.1 : 0.55 },
              y: { duration: 0.55, delay: 0.28 + i * 0.12, ease: [0.4, 0, 0.2, 1] },
            }}
            className={`rounded-2xl border flex flex-col overflow-hidden min-h-0 ${
              accent
                ? "border-[var(--color-accent)] bg-[var(--color-bg-dark)]"
                : "border-[rgba(255,255,255,0.35)] bg-[var(--color-bg-dark)]"
            }`}
          >
            {/* Header strip */}
            <div
              className={`flex-shrink-0 px-7 pt-5 pb-4 flex items-center gap-4 border-b ${
                accent ? "border-[rgba(255,107,53,0.2)]" : "border-[rgba(255,255,255,0.07)]"
              }`}
            >
              <span
                className={`font-mono text-sm font-bold tracking-[0.18em] ${
                  accent ? "text-[var(--color-accent)]" : "text-white/30"
                }`}
              >
                {num}
              </span>
              <div className="flex-1">
                <h3 className="font-black text-4xl text-white uppercase tracking-tight leading-none">
                  {label}
                </h3>
                <span
                  className={`font-mono text-sm uppercase tracking-[0.16em] ${
                    accent ? "text-[var(--color-accent)]" : "text-white/60"
                  }`}
                >
                  {subtitle}
                </span>
              </div>
              {/* Badge */}
              {accent ? (
                <span className="flex-shrink-0 bg-[var(--color-accent)] text-white font-mono text-xs font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-md">
                  ✓ {badge}
                </span>
              ) : (
                <span className="flex-shrink-0 border border-white/25 text-white/40 font-mono text-xs font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-md">
                  → {badge}
                </span>
              )}
            </div>

            {/* Diagram — star of the show */}
            <div className="flex-1 flex items-center justify-center px-6 py-4 min-h-0">
              {diagram}
            </div>

            {/* Description strip */}
            <div
              className={`flex-shrink-0 px-7 py-4 border-t ${
                accent ? "border-[rgba(255,107,53,0.12)]" : "border-[rgba(255,255,255,0.05)]"
              }`}
            >
              <p className="text-lg text-white/75 leading-snug">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
