import type { ComponentType } from "react";

export type SlideId =
  | "cover"
  | "problem"
  | "what-is-pr"
  | "single-repo"
  | "flow"
  | "demo"
  | "merge-strategies"
  | "closing";

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
