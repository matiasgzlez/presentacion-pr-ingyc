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
    // Quadratic bezier: M(300,250) Q(500,80) (700,250)
    path: "M 300 250 Q 500 80 700 250",
    labelPos: { x: 415, y: 230 },
    // Points on the bezier at t=0.25, 0.5, 0.75
    commitPositions: [
      { x: 400, y: 186 },
      { x: 500, y: 165 },
      { x: 600, y: 186 },
    ],
  },
  {
    id: "dashboard",
    name: "feature/dashboard",
    color: "#6B6B6B",
    commits: 2,
    status: "pending",
    reviewer: "@juan",
    // Quadratic bezier: M(750,250) Q(875,420) (1000,250)
    path: "M 750 250 Q 875 420 1000 250",
    labelPos: { x: 800, y: 410 },
    // Points on the bezier at t=0.33 and t=0.67
    commitPositions: [
      { x: 833, y: 325 },
      { x: 917, y: 325 },
    ],
  },
  {
    id: "auth",
    name: "bugfix/auth",
    color: "#B0B0B0",
    commits: 1,
    status: "idle",
    reviewer: "@lucia",
    // Quadratic bezier: M(180,250) Q(230,100) (280,250)
    path: "M 180 250 Q 230 100 280 250",
    labelPos: { x: 175, y: 290 },
    // Point on the bezier at t=0.5: midpoint formula
    commitPositions: [{ x: 230, y: 175 }],
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
          x2={1080}
          y2={250}
          stroke="#0A0A0A"
          strokeWidth={7}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: masterDuration, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* master label */}
        <motion.text
          x={1100}
          y={255}
          dominantBaseline="middle"
          className="font-mono"
          fontSize={26}
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
                initial={{ pathLength: 0, strokeWidth: 5 }}
                animate={{
                  pathLength: 1,
                  strokeWidth: isActive ? 8 : 5,
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

              {/* Commits */}
              {branch.commitPositions.map((pos, ci) => (
                <motion.circle
                  key={ci}
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 18 : 16}
                  fill={branch.color}
                  stroke="#FFFFFF"
                  strokeWidth={3}
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
            r={11}
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
            className="pointer-events-none absolute z-10 bg-[#0A0A0A] text-white px-5 py-3 rounded-md text-xl font-mono shadow-xl whitespace-nowrap"
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
