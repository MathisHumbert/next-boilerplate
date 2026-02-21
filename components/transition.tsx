"use client";

import { useRef } from "react";
import gsap from "gsap";
import imagesLoaded from "imagesloaded";
import { TransitionRouter } from "next-transition-router";

import { delay } from "@/libs/utils";
import { $isPageVisible } from "@/store/global";

interface TransitionProps {
  children: React.ReactNode;
}

const allowTransitions = process.env.NODE_ENV !== "development";
// const allowTransitions = true;

export function Transition({ children }: TransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadPage = (): Promise<void> => {
    return new Promise(async (res) => {
      await delay(0.1);

      if (containerRef.current) {
        const images = document.querySelectorAll('img[loading="eager"]');
        imagesLoaded(images, () => res());
      } else {
        res();
      }
    });
  };

  return (
    <div id="scroll-wrapper">
      <div id="scroll-content">
        <TransitionRouter
          auto={true}
          leave={(next, from, to) => {
            $isPageVisible.set(false);

            document.documentElement.classList.remove("visible");

            const tl = gsap.timeline({
              onComplete: () => {
                next();
              },
            });

            if (allowTransitions) {
              tl.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "sine.out",
              });
            }

            return () => {
              tl.kill();

              $isPageVisible.set(true);
              document.documentElement.classList.add("visible");
            };
          }}
          enter={async (next) => {
            next();

            await loadPage();

            const tl = gsap.timeline();

            if (allowTransitions) {
              tl.to(containerRef.current, {
                opacity: 1,
                duration: 0.5,
                delay: 0.2,
                ease: "sine.out",
              });
            }

            return () => tl.kill();
          }}
        >
          <main className="content" ref={containerRef}>
            {children}
          </main>
        </TransitionRouter>
      </div>
    </div>
  );
}
