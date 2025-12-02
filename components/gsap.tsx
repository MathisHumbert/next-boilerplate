"use client";

import gsap from "gsap";
import { SplitText, ScrollTrigger } from "gsap/all";
import { useTempus } from "tempus/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  gsap.defaults({ ease: "none" });

  gsap.ticker.lagSmoothing(0);
  gsap.ticker.remove(gsap.updateRoot);

  ScrollTrigger.clearScrollMemory("manual");
  ScrollTrigger.defaults({
    // markers: process.env.NODE_ENV === "development",
  });
}

export function GSAP() {
  useTempus((time) => {
    gsap.updateRoot(time / 1000);
  });

  return null;
}
