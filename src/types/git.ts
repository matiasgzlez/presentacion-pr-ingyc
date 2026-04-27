export type Commit = {
  id: string;
  hash: string;
  branch: string;
  message: string;
  pushed: boolean;
};

export type Branch = {
  name: string;
  color: string;
  parentBranch?: string;
  createdAt?: number;
  merged?: boolean;
};

export type FileChange = {
  name: string;
  status: "added" | "modified" | "deleted";
};

export type PRStatus = "none" | "draft" | "open" | "approved" | "merged";

export type TerminalLine =
  | { type: "command"; text: string }
  | { type: "output"; text: string }
  | { type: "error"; text: string }
  | { type: "success"; text: string };

export type GitState = {
  branches: Branch[];
  currentBranch: string;
  commits: Commit[];
  stagedFiles: string[];
  filesChanged: FileChange[];
  prStatus: PRStatus;
  terminalHistory: TerminalLine[];
};

export type GitAction =
  | { type: "CHECKOUT_BRANCH"; name: string }
  | { type: "STAGE_ALL" }
  | { type: "COMMIT"; hash: string; message: string }
  | { type: "PUSH" }
  | { type: "PR_CREATE" }
  | { type: "PR_APPROVE" }
  | { type: "PR_MERGE"; hash: string }
  | { type: "CLEAR_TERMINAL" }
  | { type: "APPEND_LINE"; line: TerminalLine }
  | { type: "RESET" };
