"use client";

import { useReducer } from "react";
import type {
  Branch,
  Commit,
  FileChange,
  GitAction,
  GitState,
} from "@/types/git";

const FEATURE_BRANCH_COLOR = "#FF6B35";

const initialFiles: FileChange[] = [
  { name: "src/components/Saludo.tsx", status: "new file" },
  { name: "README.md", status: "modified" },
];

export const initialGitState: GitState = {
  branches: [{ name: "main", color: "#0A0A0A" }],
  currentBranch: "main",
  commits: [
    {
      id: "1",
      hash: "a3f2c1b",
      branch: "main",
      message: "initial commit",
      pushed: true,
    },
    {
      id: "2",
      hash: "7e9d4f0",
      branch: "main",
      message: "add readme",
      pushed: true,
    },
  ],
  stagedFiles: [],
  filesChanged: [],
  prStatus: "none",
  terminalHistory: [],
};

function gitReducer(state: GitState, action: GitAction): GitState {
  switch (action.type) {
    case "CHECKOUT_BRANCH": {
      const exists = state.branches.find((b) => b.name === action.name);
      if (exists) {
        return { ...state, currentBranch: action.name };
      }
      const masterCommitsCount = state.commits.filter(
        (c) => c.branch === "main",
      ).length;
      const newBranch: Branch = {
        name: action.name,
        color: FEATURE_BRANCH_COLOR,
        parentBranch: state.currentBranch,
        createdAt: masterCommitsCount - 1,
      };
      return {
        ...state,
        branches: [...state.branches, newBranch],
        currentBranch: action.name,
      };
    }
    case "STAGE_ALL": {
      return {
        ...state,
        stagedFiles: initialFiles.map((f) => f.name),
        filesChanged: initialFiles,
      };
    }
    case "COMMIT": {
      const newCommit: Commit = {
        id: String(state.commits.length + 1),
        hash: action.hash,
        branch: state.currentBranch,
        message: action.message,
        pushed: false,
      };
      return {
        ...state,
        commits: [...state.commits, newCommit],
        stagedFiles: [],
      };
    }
    case "PUSH": {
      return {
        ...state,
        commits: state.commits.map((c) =>
          c.branch === state.currentBranch ? { ...c, pushed: true } : c,
        ),
      };
    }
    case "PR_CREATE":
      return { ...state, prStatus: "open" };
    case "PR_APPROVE":
      return { ...state, prStatus: "approved" };
    case "PR_MERGE": {
      const mergeCommit: Commit = {
        id: String(state.commits.length + 1),
        hash: action.hash,
        branch: "main",
        message: `Merge ${state.currentBranch} into main`,
        pushed: true,
      };
      return {
        ...state,
        commits: [...state.commits, mergeCommit],
        branches: state.branches.map((b) =>
          b.name === state.currentBranch ? { ...b, merged: true } : b,
        ),
        currentBranch: "main",
        prStatus: "merged",
        filesChanged: [],
      };
    }
    case "CLEAR_TERMINAL":
      return { ...state, terminalHistory: [] };
    case "APPEND_LINE":
      return {
        ...state,
        terminalHistory: [...state.terminalHistory, action.line],
      };
    case "RESET":
      return { ...initialGitState, terminalHistory: [] };
    default:
      return state;
  }
}

export function useGitState() {
  return useReducer(gitReducer, initialGitState);
}
