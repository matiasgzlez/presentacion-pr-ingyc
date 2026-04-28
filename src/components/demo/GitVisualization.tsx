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
  const { masterCommits, featureBranch, featureCommits, layout, mergeCommitIdx } = useMemo(() => {
    const masterCommits = state.commits.filter((c) => c.branch === "main");
    const featureBranch = state.branches.find((b) => b.name !== "main");
    const featureCommits = featureBranch
      ? state.commits.filter((c) => c.branch === featureBranch.name)
      : [];

    const branchOriginIdx = featureBranch?.createdAt ?? -1;
    const branchOriginX_ = MASTER_X_START + Math.max(0, branchOriginIdx) * COMMIT_SPACING;

    const featureCommitX = (i: number) =>
      branchOriginX_ + COMMIT_SPACING * 0.85 + i * (COMMIT_SPACING * 0.85);

    const mergeCommitIdx =
      featureBranch?.merged && masterCommits.length > 0
        ? masterCommits.length - 1
        : -1;

    // Position the merge commit far enough right of the last feature commit
    const lastFeatureX =
      featureCommits.length > 0
        ? featureCommitX(featureCommits.length - 1)
        : branchOriginX_ + COMMIT_SPACING * 0.85;
    const mergeCommitX = lastFeatureX + 90;

    const masterX = (i: number) => {
      if (i === mergeCommitIdx) return mergeCommitX;
      return MASTER_X_START + i * COMMIT_SPACING;
    };

    return {
      masterCommits,
      featureBranch,
      featureCommits,
      mergeCommitIdx,
      layout: { masterX, branchOriginX: branchOriginX_, featureCommitX },
    };
  }, [state.commits, state.branches]);

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

    if (featureBranch.merged && mergeCommitIdx >= 0) {
      const mergeX = layout.masterX(mergeCommitIdx);
      // Lane ends just past last commit but never past the merge X (would cause backwards curve)
      const cornerX = Math.min(lastFeatureX + 25, mergeX - 5);
      // Quadratic with control at (mergeX, FEATURE_Y) creates a clean quarter-arc into the merge commit
      return `M ${startX} ${startY} Q ${apexLiftX} ${FEATURE_Y} ${laneStartX} ${FEATURE_Y} L ${cornerX} ${FEATURE_Y} Q ${mergeX} ${FEATURE_Y} ${mergeX} ${MASTER_Y}`;
    }

    const horizontalEndX = Math.max(laneStartX, lastFeatureX) + 40;
    return `M ${startX} ${startY} Q ${apexLiftX} ${FEATURE_Y} ${laneStartX} ${FEATURE_Y} L ${horizontalEndX} ${FEATURE_Y}`;
  })();

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 1040 340"
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
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* master label */}
        <text
          x={965}
          y={MASTER_Y}
          dominantBaseline="middle"
          fontSize={22}
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
            strokeWidth={5}
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

        {/* Branch label - positioned far above and to the left, away from commit hashes */}
        {featureBranch && (
          <motion.text
            x={layout.branchOriginX + 30}
            y={FEATURE_Y - 75}
            fontSize={18}
            fontWeight={700}
            fill={featureBranch.color}
            className="font-mono"
            initial={{ opacity: 0, y: FEATURE_Y - 65 }}
            animate={{
              opacity: featureBranch.merged ? 0.5 : 1,
              y: FEATURE_Y - 75,
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
                r={isMerge ? 22 : 17}
                fill="#0A0A0A"
                stroke="#FFFFFF"
                strokeWidth={3}
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
                  r={17}
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth={3}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 }}
                />
              )}
              <text
                x={x}
                y={MASTER_Y + 42}
                textAnchor="middle"
                fontSize={16}
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
                  r={16}
                  fill={commit.pushed ? color : "#FFFFFF"}
                  stroke={color}
                  strokeWidth={4}
                  strokeDasharray={commit.pushed ? "0" : "5 4"}
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
                  y={y - 30}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={600}
                  fill={color}
                  className="font-mono"
                >
                  {commit.hash}
                </text>
                <text
                  x={x}
                  y={y + 40}
                  textAnchor="middle"
                  fontSize={14}
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
            const onMaster = state.currentBranch === "main";
            const isAfterMerge = onMaster && mergeCommitIdx >= 0;
            const baseX = onMaster
              ? layout.masterX(masterCommits.length - 1)
              : featureCommits.length > 0
                ? layout.featureCommitX(featureCommits.length - 1)
                : layout.branchOriginX + COMMIT_SPACING * 0.85;
            // Offset HEAD to the right after a merge so it doesn't overlap the merge curve
            const x = isAfterMerge ? baseX + 70 : baseX;
            const y = onMaster ? MASTER_Y - 65 : FEATURE_Y + 70;
            return (
              <g>
                <rect
                  x={x - 34}
                  y={y - 16}
                  width={68}
                  height={28}
                  rx={5}
                  fill="#FF6B35"
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={700}
                  fill="#FFFFFF"
                  className="font-mono"
                >
                  HEAD
                </text>
                {isAfterMerge && (
                  <line
                    x1={baseX}
                    y1={MASTER_Y - 22}
                    x2={x - 34}
                    y2={y}
                    stroke="#FF6B35"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                  />
                )}
              </g>
            );
          })()}
        </motion.g>
      </svg>
    </div>
  );
}
