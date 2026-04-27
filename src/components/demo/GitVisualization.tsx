"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { GitState } from "@/types/git";

type Props = {
  state: GitState;
  className?: string;
};

const MASTER_Y = 230;
const FEATURE_Y = 90;
const MASTER_X_START = 100;
const COMMIT_SPACING = 130;

export default function GitVisualization({ state, className = "" }: Props) {
  const { masterCommits, featureBranch, featureCommits, layout } = useMemo(() => {
    const masterCommits = state.commits.filter((c) => c.branch === "master");
    const featureBranch = state.branches.find((b) => b.name !== "master");
    const featureCommits = featureBranch
      ? state.commits.filter((c) => c.branch === featureBranch.name)
      : [];

    const masterX = (i: number) => MASTER_X_START + i * COMMIT_SPACING;

    const branchOriginIdx = featureBranch?.createdAt ?? -1;
    const branchOriginX = masterX(Math.max(0, branchOriginIdx));
    const featureCommitX = (i: number) =>
      branchOriginX + COMMIT_SPACING * 0.85 + i * (COMMIT_SPACING * 0.85);

    return {
      masterCommits,
      featureBranch,
      featureCommits,
      layout: { masterX, branchOriginX, featureCommitX },
    };
  }, [state.commits, state.branches]);

  // The merge commit on master (if any) is the last master commit added after a feature branch was merged
  const mergeCommitIdx =
    featureBranch?.merged && masterCommits.length > 0
      ? masterCommits.length - 1
      : -1;

  // Branch path: from origin master commit, curve up to feature lane, run horizontally
  // If merged, return curve to the merge commit on master
  const branchPath = (() => {
    if (!featureBranch) return null;
    const startX = layout.branchOriginX;
    const startY = MASTER_Y;
    const apexLiftX = startX + 50;
    const laneStartX = startX + 90;
    const lastFeatureX =
      featureCommits.length > 0
        ? layout.featureCommitX(featureCommits.length - 1)
        : laneStartX + 30;
    const horizontalEndX = Math.max(laneStartX, lastFeatureX) + 40;

    let d = `M ${startX} ${startY} Q ${apexLiftX} ${FEATURE_Y} ${laneStartX} ${FEATURE_Y} L ${horizontalEndX} ${FEATURE_Y}`;

    if (featureBranch.merged && mergeCommitIdx >= 0) {
      const mergeX = layout.masterX(mergeCommitIdx);
      const mergeY = MASTER_Y;
      d += ` Q ${mergeX - 50} ${FEATURE_Y} ${mergeX} ${mergeY}`;
    }
    return d;
  })();

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 1000 320"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Master line */}
        <line
          x1={MASTER_X_START - 40}
          y1={MASTER_Y}
          x2={950}
          y2={MASTER_Y}
          stroke="#0A0A0A"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* master label */}
        <text
          x={955}
          y={MASTER_Y}
          dominantBaseline="middle"
          fontSize={13}
          fontWeight={700}
          fill="#0A0A0A"
          className="font-mono"
        >
          main
        </text>

        {/* Branch path */}
        {featureBranch && branchPath && (
          <motion.path
            key={`branch-${featureBranch.name}`}
            d={branchPath}
            stroke={featureBranch.color}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: featureBranch.merged ? 0.45 : 1,
            }}
            transition={{
              pathLength: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
              opacity: featureBranch.merged
                ? { duration: 0.8, delay: 0.5 }
                : { duration: 0.3 },
            }}
          />
        )}

        {/* Branch label */}
        {featureBranch && (
          <motion.text
            x={layout.branchOriginX + 95}
            y={FEATURE_Y - 28}
            fontSize={12}
            fontWeight={600}
            fill={featureBranch.color}
            className="font-mono"
            initial={{ opacity: 0, y: FEATURE_Y - 20 }}
            animate={{
              opacity: featureBranch.merged ? 0.5 : 1,
              y: FEATURE_Y - 28,
            }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {featureBranch.name}
          </motion.text>
        )}

        {/* Master commits */}
        {masterCommits.map((commit, i) => {
          const x = layout.masterX(i);
          const isMerge = i === mergeCommitIdx;
          return (
            <g key={commit.id}>
              <motion.circle
                cx={x}
                cy={MASTER_Y}
                r={isMerge ? 16 : 12}
                fill="#0A0A0A"
                stroke="#FFFFFF"
                strokeWidth={2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 18,
                  delay: isMerge ? 0.3 : 0,
                }}
                style={{ transformOrigin: `${x}px ${MASTER_Y}px` }}
              />
              {isMerge && (
                <motion.circle
                  cx={x}
                  cy={MASTER_Y}
                  r={12}
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth={2}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 }}
                />
              )}
              <text
                x={x}
                y={MASTER_Y + 30}
                textAnchor="middle"
                fontSize={11}
                fill="#6B6B6B"
                className="font-mono"
              >
                {commit.hash}
              </text>
            </g>
          );
        })}

        {/* Feature commits */}
        <AnimatePresence>
          {featureCommits.map((commit, i) => {
            const x = layout.featureCommitX(i);
            const y = FEATURE_Y;
            const color = featureBranch?.color ?? "#FF6B35";
            return (
              <motion.g
                key={commit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: featureBranch?.merged ? 0.45 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill={commit.pushed ? color : "#FFFFFF"}
                  stroke={color}
                  strokeWidth={2.5}
                  strokeDasharray={commit.pushed ? "0" : "4 3"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 18,
                  }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
                <text
                  x={x}
                  y={y - 22}
                  textAnchor="middle"
                  fontSize={11}
                  fill={color}
                  className="font-mono"
                >
                  {commit.hash}
                </text>
                <text
                  x={x}
                  y={y + 30}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6B6B6B"
                  className="font-mono"
                >
                  {commit.message.length > 14
                    ? commit.message.slice(0, 13) + "…"
                    : commit.message}
                </text>
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* HEAD pointer */}
        <motion.g
          key={`head-${state.currentBranch}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {(() => {
            const onMaster = state.currentBranch === "master";
            const x = onMaster
              ? layout.masterX(masterCommits.length - 1)
              : featureCommits.length > 0
                ? layout.featureCommitX(featureCommits.length - 1)
                : layout.branchOriginX + COMMIT_SPACING * 0.85;
            const y = onMaster ? MASTER_Y - 50 : FEATURE_Y + 55;
            return (
              <g>
                <rect
                  x={x - 24}
                  y={y - 12}
                  width={48}
                  height={20}
                  rx={4}
                  fill="#FF6B35"
                />
                <text
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#FFFFFF"
                  className="font-mono"
                >
                  HEAD
                </text>
              </g>
            );
          })()}
        </motion.g>
      </svg>
    </div>
  );
}
