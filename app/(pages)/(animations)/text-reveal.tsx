"use client";

import { useEffect, useRef, cloneElement, ReactElement } from "react";
import { SplitText } from "gsap/all";
import { useStore } from "@nanostores/react";

import { $areFontsLoaded } from "@/store/global";

interface TextRevealProps {
  children: ReactElement;
  scrollPosition?: string;
  scrollOffset?: string;
  delay?: number;
  rotate?: number;
  ignoreFold?: boolean;
}

export function TextReveal({
  children,
  scrollPosition = "start,end",
  scrollOffset = "0,0",
  delay = 0,
  rotate = 0,
  ignoreFold = false,
}: TextRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const areFontsLoaded = useStore($areFontsLoaded);

  useEffect(() => {
    if (!areFontsLoaded || !elementRef.current) return;

    new SplitText(elementRef.current, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
    });
  }, [areFontsLoaded]);

  return cloneElement(children, {
    ref: elementRef,
    style: {
      "--delay": `${delay}s`,
      "--rotate": `${rotate}deg`,
      ...(children.props as any).style,
    },
    "data-scroll": "",
    "data-scroll-position": scrollPosition,
    "data-scroll-offset": scrollOffset,
    "data-scroll-class": "is-inview",
    ...(ignoreFold && { "data-scroll-ignore-fold": "" }),
    "data-animation": "text",
  } as any);
}
