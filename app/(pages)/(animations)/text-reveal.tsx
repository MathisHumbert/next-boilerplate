"use client";

import { useRef, cloneElement, ReactElement, MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import { expoOut } from "@/libs/easing";
import { useStore } from "@/libs/store";
import { useWindowEvents } from "@/libs/events";
import { getOffset } from "@/libs/utils";

interface TextRevealProps {
  children: ReactElement;
  delay?: number;
  rotate?: number;
  target?: string | null;
  pageLoadDelay?: number;
  hoverAnimation?: boolean;
  onlyOnPageLoad?: boolean;
}

export function TextReveal({
  children,
  delay = 0,
  rotate = 0,
  target = null,
  pageLoadDelay = 0,
  hoverAnimation = false,
  onlyOnPageLoad = false,
}: TextRevealProps) {
  const splitTextRef = useRef<any>(null);
  const elementRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const isAnimated = useRef(false);
  const isInitiallyVisible = useRef(false);
  const { isPageVisible, areFontsLoaded } = useStore();
  const { height } = useWindowEvents("resize");

  useGSAP(
    () => {
      if (!areFontsLoaded || !elementRef.current) return;

      splitTextRef.current = new SplitText(elementRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          if (!isAnimated.current) {
            gsap.set(self.lines, {
              yPercent: 125,
              rotate: rotate,
              transformOrigin: "left bottom",
              willChange: "transform",
            });
          }
        },
      });

      gsap.set(splitTextRef.current.lines, {
        yPercent: 125,
        rotate: rotate,
        transformOrigin: "left bottom",
        willChange: "transform",
      });

      const { top } = getOffset(elementRef.current);
      isInitiallyVisible.current = top < height;

      if (target && elementRef.current) {
        triggerRef.current = elementRef.current.closest(target);
      } else {
        triggerRef.current = elementRef.current;
      }
    },
    { dependencies: [areFontsLoaded] }
  );

  useGSAP(
    () => {
      if (!isPageVisible || !elementRef.current) return;

      if (isInitiallyVisible.current) {
        gsap.to(splitTextRef.current.lines, {
          yPercent: 0,
          rotate: 0,
          force3D: true,
          duration: 1.5,
          ease: expoOut,
          stagger: 0.1,
          delay: pageLoadDelay + delay,
          onStart: () => {
            isAnimated.current = true;
          },
        });
      } else if (!onlyOnPageLoad) {
        gsap.to(splitTextRef.current.lines, {
          yPercent: 0,
          rotate: 0,
          force3D: true,
          duration: 1.5,
          ease: expoOut,
          stagger: 0.1,
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
        gsap.set(splitTextRef.current.lines, {
          yPercent: 0,
          rotate: 0,
        });
        splitTextRef.current.revert();
      }
    },
    { dependencies: [isPageVisible] }
  );

  const handleMouseEnter = () => {
    if (hoverAnimation && isAnimated) {
    }
  };

  const existingMouseEnter = (children.props as any).onMouseEnter;

  const combinedMouseEnter = (e: MouseEvent<HTMLElement>) => {
    if (existingMouseEnter) {
      existingMouseEnter(e);
    }
    if (hoverAnimation) {
      handleMouseEnter();
    }
  };

  return cloneElement(children, {
    ref: elementRef,
    onMouseEnter: combinedMouseEnter,
  } as any);
}
