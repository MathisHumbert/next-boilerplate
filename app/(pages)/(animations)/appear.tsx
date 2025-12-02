"use client";

import { useRef, cloneElement, ReactElement } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useStore } from "@/libs/store";
import { useWindowEvents } from "@/libs/events";
import { getOffset } from "@/libs/utils";
import { easeInOut } from "@/libs/easing";

interface AppearProps {
  children: ReactElement;
  delay?: number;
  target?: string | null;
  pageLoadDelay?: number;
  onlyOnPageLoad?: boolean;
}

export function Appear({
  children,
  delay = 0,
  target = null,
  pageLoadDelay = 0,
  onlyOnPageLoad = false,
}: AppearProps) {
  const elementRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const isAnimated = useRef<boolean>(false);
  const isInitiallyVisible = useRef<boolean>(false);
  const { isPageVisible } = useStore();
  const { height } = useWindowEvents("resize");

  useGSAP(() => {
    if (!elementRef.current) return;

    gsap.set(elementRef.current, {
      opacity: 0,
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
          opacity: 1,
          duration: 1,
          ease: easeInOut,
          delay: pageLoadDelay + delay,
          onStart: () => {
            isAnimated.current = true;
          },
        });
      } else if (onlyOnPageLoad) {
        gsap.to(elementRef.current, {
          opacity: 1,
          duration: 1,
          ease: easeInOut,
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
        gsap.set(elementRef.current, { opacity: 1 });
      }
    },
    { dependencies: [isPageVisible] }
  );

  return cloneElement(children, { ref: elementRef } as any);
}
