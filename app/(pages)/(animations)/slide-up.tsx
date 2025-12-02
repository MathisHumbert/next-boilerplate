"use client";

import { useRef, cloneElement, ReactElement } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useStore } from "@/libs/store";
import { useWindowEvents } from "@/libs/events";
import { getOffset } from "@/libs/utils";
import { easeOut } from "@/libs/easing";

interface SlideUpProps {
  children: ReactElement;
  delay?: number;
  target?: string | null;
  opacity?: boolean;
  pageLoadDelay?: number;
  yPercent?: number;
  onlyOnPageLoad?: boolean;
}

export function SlideUp({
  children,
  delay = 0,
  target = null,
  opacity = false,
  pageLoadDelay = 0,
  yPercent = 20,
  onlyOnPageLoad = false,
}: SlideUpProps) {
  const elementRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const isAnimated = useRef<boolean>(false);
  const isInitiallyVisible = useRef<boolean>(false);
  const { isPageVisible } = useStore();
  const { height } = useWindowEvents("resize");

  useGSAP(() => {
    if (!elementRef.current) return;

    const { top } = getOffset(elementRef.current);
    isInitiallyVisible.current = top < height;

    gsap.set(elementRef.current, {
      yPercent,
      willChange: "transform",
      opacity: opacity ? 0 : 1,
    });

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
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: easeOut,
          delay: pageLoadDelay + delay,
          onStart: () => {
            isAnimated.current = true;
          },
        });
      } else if (!onlyOnPageLoad) {
        gsap.to(elementRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: easeOut,
          delay: delay,
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
        gsap.set(elementRef.current, {
          yPercent: 0,
          opacity: 1,
        });
      }
    },
    { dependencies: [isPageVisible] }
  );

  return cloneElement(children, { ref: elementRef } as any);
}
