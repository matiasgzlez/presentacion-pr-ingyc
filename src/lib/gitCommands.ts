import type { Dispatch } from "react";
import type { GitAction, GitState, TerminalLine } from "@/types/git";

function generateHash(): string {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < 7; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

const HELP_TEXT = [
  "Available commands:",
  "  git status",
  '  git checkout -b <branch>',
  "  git add . | git add <file>",
  '  git commit -m "<message>"',
  "  git push | git push -u origin <branch>",
  "  git pr create | git pr approve | git pr merge",
  "  git log --oneline",
  "  clear | help",
];

export type ExecuteResult = { success: boolean };

export function executeCommand(
  input: string,
  state: GitState,
  dispatch: Dispatch<GitAction>,
): ExecuteResult {
  const trimmed = input.trim();
  const append = (line: TerminalLine) =>
    dispatch({ type: "APPEND_LINE", line });

  if (!trimmed) return { success: false };

  // git status
  if (trimmed === "git status") {
    append({ type: "output", text: `On branch ${state.currentBranch}` });
    if (state.filesChanged.length > 0) {
      append({ type: "output", text: "Changes to be committed:" });
      for (const f of state.filesChanged) {
        append({ type: "output", text: `        ${f.status}:   ${f.name}` });
      }
    } else {
      append({
        type: "output",
        text: "nothing to commit, working tree clean",
      });
    }
    return { success: true };
  }

  // git checkout -b <name>
  const checkoutNew = trimmed.match(/^git\s+checkout\s+-b\s+(\S+)$/);
  if (checkoutNew) {
    const name = checkoutNew[1];
    dispatch({ type: "CHECKOUT_BRANCH", name });
    append({ type: "output", text: `Switched to a new branch '${name}'` });
    return { success: true };
  }

  // git checkout <name>
  const checkout = trimmed.match(/^git\s+checkout\s+(\S+)$/);
  if (checkout && !trimmed.includes("-b")) {
    const name = checkout[1];
    const exists = state.branches.find((b) => b.name === name);
    if (!exists) {
      append({
        type: "error",
        text: `error: pathspec '${name}' did not match any branch`,
      });
      return { success: false };
    }
    dispatch({ type: "CHECKOUT_BRANCH", name });
    append({ type: "output", text: `Switched to branch '${name}'` });
    return { success: true };
  }

  // git add
  if (trimmed === "git add ." || /^git\s+add\s+\S+$/.test(trimmed)) {
    dispatch({ type: "STAGE_ALL" });
    return { success: true };
  }

  // git commit -m "..."
  const commitMatch = trimmed.match(
    /^git\s+commit\s+-m\s+["']([^"']+)["']\s*$/,
  );
  if (commitMatch) {
    if (state.stagedFiles.length === 0 && state.filesChanged.length === 0) {
      append({
        type: "error",
        text: "nothing to commit, working tree clean",
      });
      return { success: false };
    }
    const message = commitMatch[1];
    const hash = generateHash();
    dispatch({ type: "COMMIT", hash, message });
    append({
      type: "output",
      text: `[${state.currentBranch} ${hash}] ${message}`,
    });
    append({
      type: "output",
      text: ` 2 files changed, 14 insertions(+), 1 deletion(-)`,
    });
    return { success: true };
  }

  // git push
  if (
    trimmed === "git push" ||
    /^git\s+push\s+-u\s+origin\s+\S+$/.test(trimmed) ||
    /^git\s+push\s+origin\s+\S+$/.test(trimmed)
  ) {
    dispatch({ type: "PUSH" });
    append({
      type: "output",
      text: `Enumerating objects: 5, done.`,
    });
    append({
      type: "output",
      text: ` * [new branch]      ${state.currentBranch} -> ${state.currentBranch}`,
    });
    return { success: true };
  }

  // git pr create
  if (trimmed === "git pr create") {
    if (state.currentBranch === "master") {
      append({
        type: "error",
        text: "error: cannot create PR from master to master",
      });
      return { success: false };
    }
    dispatch({ type: "PR_CREATE" });
    append({ type: "success", text: "Pull request #1 created" });
    append({
      type: "output",
      text: `https://github.com/team/repo/pull/1`,
    });
    return { success: true };
  }

  // git pr approve
  if (trimmed === "git pr approve") {
    if (state.prStatus !== "open") {
      append({ type: "error", text: "error: no open PR to approve" });
      return { success: false };
    }
    dispatch({ type: "PR_APPROVE" });
    append({ type: "success", text: "✓ Approved by @reviewer" });
    return { success: true };
  }

  // git pr merge
  if (trimmed === "git pr merge") {
    if (state.prStatus !== "approved") {
      append({
        type: "error",
        text: "error: PR must be approved before merging",
      });
      return { success: false };
    }
    const hash = generateHash();
    dispatch({ type: "PR_MERGE", hash });
    append({
      type: "success",
      text: "Merged pull request #1 into master",
    });
    return { success: true };
  }

  // git log --oneline
  if (trimmed === "git log --oneline" || trimmed === "git log") {
    const list = [...state.commits].reverse();
    for (const c of list) {
      append({
        type: "output",
        text: `${c.hash} (${c.branch}) ${c.message}`,
      });
    }
    return { success: true };
  }

  // git branch
  if (trimmed === "git branch") {
    for (const b of state.branches) {
      const marker = b.name === state.currentBranch ? "* " : "  ";
      append({ type: "output", text: `${marker}${b.name}` });
    }
    return { success: true };
  }

  // clear / cls
  if (trimmed === "clear" || trimmed === "cls") {
    dispatch({ type: "CLEAR_TERMINAL" });
    return { success: true };
  }

  // help
  if (trimmed === "help") {
    for (const line of HELP_TEXT) {
      append({ type: "output", text: line });
    }
    return { success: true };
  }

  append({
    type: "error",
    text: `command not found: ${trimmed.split(" ")[0]}`,
  });
  return { success: false };
}
