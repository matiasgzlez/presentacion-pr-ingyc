"use client";

import { useState, useRef, type MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

type BranchStatus = "active" | "pending" | "idle";

type CommitPos = { x: number; y: number };

type BranchData = {
  id: string;
  name: string;
  color: string;
  commits: number;
  status: BranchStatus;
  reviewer: string;
  path: string;
  labelPos: { x: number; y: number };
  commitPositions: CommitPos[];
};

const branches: BranchData[] = [
  {
    id: "login",
    name: "feature/login",
    color: "#FF6B35",
    commits: 3,
    status: "active",
    reviewer: "@maria",
    path: "M 300 250 Q 425 120 550 120 Q 675 120 700 250",
    labelPos: { x: 500, y: 100 },
    commitPositions: [
      { x: 400, y: 158 },
      { x: 500, y: 124 },
      { x: 620, y: 138 },
    ],
  },
  {
    id: "dashboard",
    name: "feature/dashboard",
    color: "#6B6B6B",
    commits: 2,
    status: "pending",
    reviewer: "@juan",
    path: "M 600 250 Q 725 380 850 380 Q 950 380 950 250",
    labelPos: { x: 760, y: 415 },
    commitPositions: [
      { x: 740, y: 366 },
      { x: 870, y: 376 },
    ],
  },
  {
    id: "auth",
    name: "bugfix/auth",
    color: "#B0B0B0",
    commits: 1,
    status: "idle",
    reviewer: "@lucia",
    path: "M 200 250 Q 220 160 280 160 Q 290 250 290 250",
    labelPos: { x: 220, y: 145 },
    commitPositions: [{ x: 250, y: 168 }],
  },
];

const STATUS_LABEL: Record<BranchStatus, string> = {
  active: "active",
  pending: "pending review",
  idle: "idle",
};

export default function SingleRepoDiagram() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [entryDone, setEntryDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<SVGGElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const activeBranchData = branches.find((b) => b.id === activeBranch);

  // Total entry time: master (0.8) + 3 branches staggered (0.6) + commits (0.6) ≈ 2.0s
  const masterDuration = 0.8;
  const branchDuration = 0.4;
  const branchStart = (i: number) => masterDuration + i * 0.2;
  const commitsStart = (i: number) => branchStart(i) + branchDuration;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        viewBox="0 0 1200 500"
        className="w-full h-auto"
        style={{ display: "block" }}
      >
        {/* Master line */}
        <motion.line
          x1={100}
          y1={250}
          x2={1100}
          y2={250}
          stroke="#0A0A0A"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: masterDuration, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* master label */}
        <motion.text
          x={1115}
          y={255}
          dominantBaseline="middle"
          className="font-mono"
          fontSize={14}
          fontWeight={700}
          fill="#0A0A0A"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: masterDuration }}
        >
          main
        </motion.text>

        {/* Branches */}
        {branches.map((branch, i) => {
          const isActive = activeBranch === branch.id;
          const isDimmed = activeBranch !== null && !isActive;
          const opacity = isDimmed ? 0.25 : 1;

          return (
            <motion.g
              key={branch.id}
              animate={{ opacity }}
              transition={{ duration: 0.25 }}
              style={{ cursor: entryDone ? "pointer" : "default" }}
              onMouseEnter={() => entryDone && setActiveBranch(branch.id)}
              onMouseLeave={() => entryDone && setActiveBranch(null)}
              onMouseMove={handleMouseMove}
            >
              {/* Invisible wider hit-area for easier hover */}
              <path
                d={branch.path}
                stroke="transparent"
                strokeWidth={28}
                fill="none"
                pointerEvents="stroke"
              />

              {/* Visible branch path */}
              <motion.path
                d={branch.path}
                stroke={branch.color}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, strokeWidth: 2.5 }}
                animate={{
                  pathLength: 1,
                  strokeWidth: isActive ? 4 : 2.5,
                }}
                transition={{
                  pathLength: {
                    duration: branchDuration,
                    delay: branchStart(i),
                    ease: [0.4, 0, 0.2, 1],
                  },
                  strokeWidth: { duration: 0.2 },
                }}
              />

              {/* Branch label */}
              <motion.text
                x={branch.labelPos.x}
                y={branch.labelPos.y}
                fontSize={13}
                fontWeight={600}
                fill={branch.color}
                className="font-mono"
                initial={{ opacity: 0, y: branch.labelPos.y + (branch.id === "dashboard" ? -6 : 6) }}
                animate={{ opacity: 1, y: branch.labelPos.y }}
                transition={{ duration: 0.4, delay: commitsStart(i) }}
              >
                {branch.name}
              </motion.text>

              {/* Commits */}
              {branch.commitPositions.map((pos, ci) => (
                <motion.circle
                  key={ci}
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 11 : 10}
                  fill={branch.color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.18, 1],
                          opacity: 1,
                          transition: {
                            scale: {
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: ci * 0.15,
                            },
                            opacity: { duration: 0.2 },
                          },
                        }
                      : {
                          scale: 1,
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 320,
                            damping: 18,
                            delay: commitsStart(i) + ci * 0.12,
                          },
                        }
                  }
                  style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  onAnimationComplete={() => {
                    if (
                      i === branches.length - 1 &&
                      ci === branch.commitPositions.length - 1 &&
                      !entryDone
                    ) {
                      setEntryDone(true);
                    }
                  }}
                />
              ))}
            </motion.g>
          );
        })}

        {/* Master commits (small black dots along main) */}
        {[150, 400, 800, 1050].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={250}
            r={6}
            fill="#0A0A0A"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 18,
              delay: 0.2 + i * 0.12,
            }}
          />
        ))}
      </svg>

      <AnimatePresence>
        {activeBranchData && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-10 bg-[#0A0A0A] text-white px-4 py-2 rounded-md text-sm font-mono shadow-xl whitespace-nowrap"
            style={{
              top: tooltip.y + 16,
              left: tooltip.x + 16,
              transformOrigin: "top left",
            }}
          >
            <span style={{ color: activeBranchData.color }}>●</span>{" "}
            {activeBranchData.commits} commits ·{" "}
            {STATUS_LABEL[activeBranchData.status]} · {activeBranchData.reviewer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
