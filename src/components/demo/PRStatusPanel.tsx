"use client";

import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Minus, GitPullRequest } from "lucide-react";
import type { FileChange, PRStatus } from "@/types/git";

type Props = {
  filesChanged: FileChange[];
  status: PRStatus;
  className?: string;
};

const STATUS_META: Record<
  Exclude<PRStatus, "none">,
  { label: string; bg: string; ring: string }
> = {
  draft: {
    label: "Draft",
    bg: "bg-gray-500",
    ring: "ring-gray-300",
  },
  open: {
    label: "Open · #1",
    bg: "bg-[var(--color-accent)]",
    ring: "ring-[var(--color-accent-soft)]",
  },
  approved: {
    label: "Approved · #1",
    bg: "bg-[var(--color-success)]",
    ring: "ring-green-200",
  },
  merged: {
    label: "Merged · #1",
    bg: "bg-[var(--color-merged)]",
    ring: "ring-purple-200",
  },
};

function FileIcon({ status }: { status: FileChange["status"] }) {
  if (status === "added") return <Plus size={20} className="text-[var(--color-success)]" />;
  if (status === "deleted") return <Minus size={20} className="text-red-500" />;
  return <Pencil size={20} className="text-[var(--color-accent)]" />;
}

export default function PRStatusPanel({
  filesChanged,
  status,
  className = "",
}: Props) {
  return (
    <aside
      className={`bg-[var(--color-bg-secondary)] p-7 flex flex-col gap-8 ${className}`}
    >
      <section>
        <h3 className="font-mono text-base uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-4 font-bold">
          Files Changed
          <span className="ml-2 text-[var(--color-text-primary)]">
            {filesChanged.length}
          </span>
        </h3>
        <ul className="space-y-2 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {filesChanged.length === 0 ? (
              <motion.li
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-base text-[var(--color-text-secondary)] italic"
              >
                No changes staged
              </motion.li>
            ) : (
              filesChanged.map((f, i) => (
                <motion.li
                  key={f.name}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.06,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="flex items-center gap-3 text-lg font-mono text-[var(--color-text-primary)] bg-white border border-[var(--color-divider)] rounded px-3 py-2.5"
                >
                  <FileIcon status={f.status} />
                  <span className="truncate">{f.name}</span>
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </ul>
      </section>

      <section>
        <h3 className="font-mono text-base uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-4 font-bold">
          Pull Request
        </h3>
        <div className="min-h-[56px] flex items-center">
          <AnimatePresence mode="wait">
            {status === "none" ? (
              <motion.span
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-base text-[var(--color-text-secondary)] italic"
              >
                No PR yet
              </motion.span>
            ) : (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={`inline-flex items-center gap-3 px-5 py-3 rounded-full text-white text-lg font-bold uppercase tracking-wider ring-4 ${STATUS_META[status].bg} ${STATUS_META[status].ring}`}
              >
                <GitPullRequest size={22} strokeWidth={2.5} />
                {STATUS_META[status].label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="mt-auto">
        <h3 className="font-mono text-base uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-4 font-bold">
          Reviewer
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] text-white text-xl font-bold flex items-center justify-center">
            R
          </div>
          <span className="text-lg font-mono text-[var(--color-text-primary)]">
            @reviewer
          </span>
        </div>
      </section>
    </aside>
  );
}
