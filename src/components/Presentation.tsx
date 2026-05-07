"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import type { Slide } from "@/types";
import ProgressBar from "./ProgressBar";
import Slide01Cover from "./slides/Slide01Cover";
import Slide03Definition from "./slides/Slide03Definition";
import Slide03WhatIsPR from "./slides/Slide03WhatIsPR";
import SlideRepoConfigs from "./slides/SlideRepoConfigs";
import Slide04SingleRepo from "./slides/Slide04SingleRepo";
import SlideWhenToOpen from "./slides/SlideWhenToOpen";
import Slide06Demo from "./slides/Slide06Demo";
import Slide07MergeStrategies from "./slides/Slide07MergeStrategies";
import Slide08Closing from "./slides/Slide08Closing";
import Slide09Thanks from "./slides/Slide09Thanks";

const slides: Slide[] = [
  { id: "cover", label: "Portada", component: Slide01Cover },
  { id: "definition", label: "Definición", component: Slide03Definition },
  { id: "what-is-pr", label: "¿Qué es un PR?", component: Slide03WhatIsPR },
  { id: "repo-configs", label: "Configuraciones", component: SlideRepoConfigs },
  { id: "single-repo", label: "Single Repository", component: Slide04SingleRepo },
  { id: "when-to-open", label: "¿Cuándo abrirlo?", component: SlideWhenToOpen },
  { id: "demo", label: "Demo en vivo", component: Slide06Demo },
  { id: "merge-strategies", label: "Estrategias de merge", component: Slide07MergeStrategies },
  { id: "closing", label: "Cierre", component: Slide08Closing },
  { id: "thanks", label: "Gracias", component: Slide09Thanks },
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const total = slides.length;

  const onNext = useCallback(() => {
    setCurrentSlide((c) => Math.min(c + 1, total - 1));
  }, [total]);

  const onPrev = useCallback(() => {
    setCurrentSlide((c) => Math.max(c - 1, 0));
  }, []);

  const onReset = useCallback(() => {
    setCurrentSlide(0);
  }, []);

  useKeyboardShortcuts({ onNext, onPrev, onReset });

  const slide = slides[currentSlide];
  const SlideComponent = slide.component;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <FollowerPointerCard
        title="Deploy en Viernes"
        className="h-full w-full"
      >
        <ProgressBar current={currentSlide} total={total} />

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>

        <div className="fixed bottom-6 right-8 z-40 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)] pointer-events-none">
          {String(currentSlide + 1).padStart(2, "0")}
          <span className="mx-1 text-[var(--color-divider)]">/</span>
          {String(total).padStart(2, "0")}
        </div>
      </FollowerPointerCard>
    </main>
  );
}
