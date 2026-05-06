import type { ComponentType } from "react";

export type SlideId =
  | "cover"
  | "problem"
  | "definition"
  | "what-is-pr"
  | "repo-configs"
  | "single-repo"
  | "when-to-open"
  | "demo"
  | "merge-strategies"
  | "closing"
  | "thanks";

export interface Slide {
  id: SlideId;
  label: string;
  component: ComponentType;
}

export interface KeyboardShortcutHandlers {
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}
