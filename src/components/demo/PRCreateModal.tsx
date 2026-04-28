"use client";

import { motion } from "motion/react";
import { GitPullRequest, GitBranch, ArrowRight } from "lucide-react";

type Props = {
  sourceBranch: string;
  targetBranch?: string;
  title?: string;
  onClose: () => void;
};

export default function PRCreateModal({
  sourceBranch,
  targetBranch = "main",
  title = "add saludo",
  onClose,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <GitPullRequest size={20} className="text-white" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Create Pull Request
          </h2>
        </div>

        <div className="flex items-center gap-3 mb-6 p-3 bg-[var(--color-bg-secondary)] rounded-lg font-mono text-sm">
          <div className="flex items-center gap-1.5 text-[var(--color-accent)]">
            <GitBranch size={14} />
            <span className="font-semibold">{sourceBranch}</span>
          </div>
          <ArrowRight size={14} className="text-[var(--color-text-secondary)]" />
          <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
            <GitBranch size={14} />
            <span className="font-semibold">{targetBranch}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
              Title
            </label>
            <div className="px-3 py-2 border border-[var(--color-divider)] rounded text-sm font-medium">
              {title}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
              Description
            </label>
            <div className="px-3 py-3 border border-[var(--color-divider)] rounded text-sm text-[var(--color-text-secondary)] italic min-h-[60px]">
              Describe your changes…
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <motion.button
            type="button"
            onClick={onClose}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
            className="px-6 py-3 text-base font-bold text-white bg-[var(--color-accent)] rounded hover:opacity-90 transition-opacity"
          >
            Continuar →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
