"use client";

import { useRef, cloneElement, ReactElement } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { easeInOut } from "@/libs/easing";
import { useStore } from "@/libs/store";
import { useWindowEvents } from "@/libs/events";
import { getOffset } from "@/libs/utils";

interface LineRevealProps {
  children: ReactElement;
  delay?: number;
  target?: string | null;
  direction?: string;
  pageLoadDelay?: number;
  onlyOnPageLoad?: boolean;
}

export function LineReveal({
  children,
  delay = 0,
  target = null,
  direction = "left",
  pageLoadDelay = 0,
  onlyOnPageLoad,
}: LineRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const isAnimated = useRef<boolean>(false);
  const isInitiallyVisible = useRef<boolean>(false);
  const { isPageVisible } = useStore();
  const { height } = useWindowEvents("resize");

  useGSAP(() => {
    if (!elementRef.current) return;

    gsap.set(elementRef.current, {
      scale: 0,
      willChange: "transform",
      transformOrigin: direction,
    });

    const { top } = getOffset(elementRef.current);
    isInitiallyVisible.current = top < height;

    if (target && elementRef.current) {
      triggerRef.current = elementRef.current.closest(target);
    } else {
      triggerRef.current = elementRef.current;
    }
  });

  useGSAP(
    () => {
      if (!isPageVisible || !elementRef.current) return;

      if (isInitiallyVisible.current) {
        gsap.to(elementRef.current, {
          scale: 1,
          duration: 1.25,
          ease: easeInOut,
          delay: pageLoadDelay + delay,
          force3D: true,
          onStart: () => {
            isAnimated.current = true;
          },
        });
      } else if (!onlyOnPageLoad) {
        gsap.to(elementRef.current, {
          scale: 1,
          duration: 1.25,
          ease: easeInOut,
          delay: delay,
          force3D: true,
          onStart: () => {
            isAnimated.current = true;
          },
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top bottom",
            once: true,
          },
        });
      } else {
        isAnimated.current = true;
        gsap.set(elementRef.current, { scale: 1 });
      }
    },
    { dependencies: [isPageVisible] }
  );

  return cloneElement(children, { ref: elementRef } as any);
}
