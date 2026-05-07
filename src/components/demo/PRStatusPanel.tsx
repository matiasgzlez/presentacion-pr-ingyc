"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitPullRequest,
  Check,
  Clock,
  GitMerge,
} from "lucide-react";
import type { FileChange, PRStatus } from "@/types/git";

type Props = {
  filesChanged: FileChange[];
  status: PRStatus;
  className?: string;
};

const EXT_COLORS: Record<string, string> = {
  tsx: "#3178C6",
  ts: "#3178C6",
  jsx: "#F7DF1E",
  js: "#F7DF1E",
  md: "#519ABA",
  css: "#1572B6",
  json: "#8B8B8B",
};

function getExt(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "file";
}

function getFilename(name: string): string {
  const parts = name.split("/");
  return parts[parts.length - 1];
}

function getDirectory(name: string): string {
  if (!name.includes("/")) return "/";
  return name.substring(0, name.lastIndexOf("/"));
}

const STATUS_META: Record<
  FileChange["status"],
  { label: string; color: string }
> = {
  "new file": { label: "+ NEW", color: "#2D9F4F" },
  modified: { label: "~ MOD", color: "#FF6B35" },
  deleted: { label: "- DEL", color: "#EF4444" },
};

function FileCard({ file, index }: { file: FileChange; index: number }) {
  const ext = getExt(file.name);
  const color = EXT_COLORS[ext] ?? "#6B6B6B";
  const filename = getFilename(file.name);
  const dir = getDirectory(file.name);
  const meta = STATUS_META[file.status];
  const tilt = index % 2 === 0 ? -1.4 : 1.4;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -28, scale: 0.82, rotate: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
      exit={{ opacity: 0, x: 32, scale: 0.85, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        delay: index * 0.16,
      }}
      whileHover={{ rotate: 0, scale: 1.03, y: -3 }}
      className="bg-white border border-[var(--color-divider)] rounded-xl p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <span
        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white text-[11px] font-mono font-bold uppercase tracking-wider"
        style={{ backgroundColor: color }}
      >
        {ext}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-base font-mono font-semibold truncate text-[var(--color-text-primary)]">
          {filename}
        </div>
        <div className="text-xs font-mono text-[var(--color-text-secondary)] truncate">
          {dir}
        </div>
      </div>
      <span
        className="text-[11px] font-mono font-bold px-2 py-1 rounded-md tracking-wider whitespace-nowrap"
        style={{
          color: meta.color,
          backgroundColor: `${meta.color}1A`,
        }}
      >
        {meta.label}
      </span>
    </motion.li>
  );
}

const PR_META: Record<
  Exclude<PRStatus, "none">,
  {
    label: string;
    sublabel: string;
    color: string;
    Icon: typeof GitPullRequest;
  }
> = {
  draft: {
    label: "Draft",
    sublabel: "PR #1 · not ready",
    color: "#6B6B6B",
    Icon: Clock,
  },
  open: {
    label: "Open",
    sublabel: "PR #1 · awaiting review",
    color: "#FF6B35",
    Icon: GitPullRequest,
  },
  approved: {
    label: "Approved",
    sublabel: "PR #1 · ready to merge",
    color: "#2D9F4F",
    Icon: Check,
  },
  merged: {
    label: "Merged",
    sublabel: "PR #1 · merged into main",
    color: "#6B3FA0",
    Icon: GitMerge,
  },
};

function PRBadge({ status }: { status: PRStatus }) {
  if (status === "none") {
    return (
      <motion.div
        key="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border-2 border-dashed border-[var(--color-divider)] rounded-2xl px-5 py-6 text-center text-base text-[var(--color-text-secondary)] italic font-mono"
      >
        No PR yet
      </motion.div>
    );
  }

  const meta = PR_META[status];
  const Icon = meta.Icon;

  return (
    <motion.div
      key={status}
      initial={{ scale: 0.6, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        backgroundColor: meta.color,
        boxShadow: `0 10px 28px ${meta.color}55, 0 0 0 4px ${meta.color}22`,
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
        }}
        initial={{ x: "-110%" }}
        animate={{ x: "110%" }}
        transition={{
          duration: 1.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2.4,
        }}
      />
      <div className="relative flex items-center gap-4 text-white">
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="text-3xl font-bold uppercase tracking-wide leading-none">
            {meta.label}
          </div>
          <div className="mt-1 text-xs font-mono opacity-90 truncate">
            {meta.sublabel}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const REVIEWERS = [
  { id: "reviewer", initials: "R", name: "@reviewer", color: "#FF6B35" },
  { id: "alex", initials: "A", name: "@alex", color: "#3178C6" },
  { id: "maria", initials: "M", name: "@maria", color: "#6B3FA0" },
];

function ReviewerStack({ status }: { status: PRStatus }) {
  const isApproved = status === "approved" || status === "merged";

  return (
    <div className="flex items-center gap-4">
      <div className="flex">
        {REVIEWERS.map((r, i) => {
          const isPrimary = r.id === "reviewer";
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.1 + i * 0.08,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{ y: -6, zIndex: 30, scale: 1.08 }}
              className="relative -ml-3 first:ml-0 w-14 h-14 rounded-full text-white text-xl font-bold flex items-center justify-center ring-[3px] ring-[var(--color-bg-secondary)] cursor-default"
              style={{
                backgroundColor: r.color,
                zIndex: REVIEWERS.length - i,
              }}
            >
              {r.initials}
              {isPrimary && isApproved && (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 16,
                    delay: 0.1,
                  }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-success)] ring-[3px] ring-[var(--color-bg-secondary)] flex items-center justify-center"
                >
                  <Check size={14} strokeWidth={3.5} className="text-white" />
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {isApproved ? (
            <motion.div
              key="approved"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="leading-tight"
            >
              <div className="text-base font-mono font-bold text-[var(--color-success)]">
                ✓ Approved
              </div>
              <div className="text-sm font-mono text-[var(--color-text-secondary)] truncate">
                by @reviewer
              </div>
            </motion.div>
          ) : status === "open" ? (
            <motion.div
              key="open"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm font-mono text-[var(--color-text-secondary)]"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                awaiting review...
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-mono text-[var(--color-text-secondary)]"
            >
              3 reviewers ready
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PRStatusPanel({
  filesChanged,
  status,
  className = "",
}: Props) {
  const filesRef = useRef<HTMLElement>(null);
  const prRef = useRef<HTMLElement>(null);
  const reviewersRef = useRef<HTMLElement>(null);

  const prevFilesCount = useRef(filesChanged.length);
  const prevStatus = useRef<PRStatus>(status);

  useEffect(() => {
    if (prevFilesCount.current === 0 && filesChanged.length > 0) {
      filesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevFilesCount.current = filesChanged.length;
  }, [filesChanged.length]);

  useEffect(() => {
    if (prevStatus.current === status) return;
    prevStatus.current = status;

    if (status === "open" || status === "draft") {
      prRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (status === "approved") {
      reviewersRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (status === "merged") {
      prRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  return (
    <aside
      className={`bg-[var(--color-bg-secondary)] p-6 flex flex-col gap-6 scroll-smooth ${className}`}
    >
      <section ref={filesRef} className="scroll-mt-4">
        <h3 className="font-mono text-base uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-4 font-bold">
          Files Changed
          <span className="ml-2 text-[var(--color-text-primary)]">
            {filesChanged.length}
          </span>
        </h3>
        <ul className="space-y-2.5 min-h-[140px]">
          <AnimatePresence mode="popLayout">
            {filesChanged.length === 0 ? (
              <motion.li
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-[var(--color-divider)] rounded-xl px-4 py-5 text-center text-base text-[var(--color-text-secondary)] italic font-mono"
              >
                No changes staged
              </motion.li>
            ) : (
              filesChanged.map((f, i) => (
                <FileCard key={f.name} file={f} index={i} />
              ))
            )}
          </AnimatePresence>
        </ul>
      </section>

      <section ref={prRef} className="scroll-mt-4">
        <h3 className="font-mono text-base uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-4 font-bold">
          Pull Request
        </h3>
        <AnimatePresence mode="wait">
          <PRBadge status={status} />
        </AnimatePresence>
      </section>

      <section ref={reviewersRef} className="mt-auto scroll-mt-4">
        <h3 className="font-mono text-base uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-4 font-bold">
          Reviewers
        </h3>
        <ReviewerStack status={status} />
      </section>
    </aside>
  );
}
