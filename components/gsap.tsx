"use client";

import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  gsap.defaults({ ease: "none" });

  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.clearScrollMemory("manual");
}

export function GSAP() {
  return null;
}
