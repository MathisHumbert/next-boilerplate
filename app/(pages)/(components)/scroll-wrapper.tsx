"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useTempus } from "tempus/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useStore } from "@/libs/store";
import { events } from "@/libs/utils";

gsap.registerPlugin(ScrollTrigger);

export function ScrollWrapper({ children }: { children: React.ReactNode }) {
  const lenisWrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { isMenuOpened, setLenis, setLenisReady } = useStore();

  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration =
        process.env.NODE_ENV === "development" ? "auto" : "manual";
    }
  }, []);

  useEffect(() => {
    if (lenisWrapperRef.current) {
      lenisRef.current = new Lenis({
        wrapper: lenisWrapperRef.current,
        content: lenisWrapperRef.current.firstChild as HTMLElement,
        lerp: 0.125,
        wheelMultiplier: 0.75,
        touchMultiplier: 0.75,
        autoRaf: false,
      });

      lenisRef.current.on("scroll", ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(lenisWrapperRef.current, {
        scrollTop(value?: number) {
          if (value !== undefined) {
            lenisRef.current!.scrollTo(value);
          }
          return lenisRef.current?.scroll || 0;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      ScrollTrigger.defaults({ scroller: "#scroll-wrapper" });

      ScrollTrigger.refresh();
      setLenis(lenisRef.current);
      setLenisReady(true);

      events.on("showPage", () => {
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
        lenisRef.current?.start();
      });

      events.on("hidePage", () => {
        lenisRef.current?.stop();
      });

      return () => {
        lenisRef.current?.destroy();
        ScrollTrigger.killAll();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMenuOpened) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [isMenuOpened, lenisRef]);

  useTempus((time: number) => {
    if (lenisRef.current) {
      lenisRef.current.raf(time);
    }
  });

  return (
    <div ref={lenisWrapperRef} id="scroll-wrapper">
      <div id="scroll-content">{children}</div>
    </div>
  );
}
