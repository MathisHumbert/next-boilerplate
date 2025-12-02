"use client";

import { useRef } from "react";
import gsap from "gsap";
import imagesLoaded from "imagesloaded";
import { TransitionRouter } from "next-transition-router";

import { delay, events } from "@/libs/utils";
import { easeOut } from "@/libs/easing";

interface TransitionProps {
  children: React.ReactNode;
}

export function Transition({ children }: TransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPage = (): Promise<void> => {
    return new Promise(async (res) => {
      await delay(0.1);

      if (containerRef.current) {
        imagesLoaded(containerRef.current, { background: true }, () => res());
      } else {
        res();
      }
    });
  };

  return (
    <TransitionRouter
      auto={true}
      leave={(next, from, to) => {
        events.emit("hidePage", from);
        document.documentElement.classList.remove("visible");

        const tl = gsap.timeline({
          onComplete: () => {
            next();
          },
        });

        if (process.env.NODE_ENV !== "development") {
          tl.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: easeOut,
          });
        }

        return () => {
          tl.kill();

          events.emit("showPage", to);
          document.documentElement.classList.add("visible");
        };
      }}
      enter={async (next) => {
        next();

        await loadPage();

        const tl = gsap.timeline();

        if (process.env.NODE_ENV !== "development") {
          tl.to(containerRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: easeOut,
          });
        }

        return () => tl.kill();
      }}
    >
      <main className="content" ref={containerRef}>
        {children}
      </main>
    </TransitionRouter>
  );
}
