"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { useTempus } from "tempus/react";

import { expoOut } from "@/libs/easing";
import { useStore } from "@/libs/store";

export function Menu() {
  const container = useRef<HTMLDivElement>(null);
  const scrollWrapper = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { isMenuOpened, setIsMenuOpened } = useStore();

  useEffect(() => {
    if (scrollWrapper.current) {
      lenisRef.current = new Lenis({
        wrapper: scrollWrapper.current,
        content: scrollWrapper.current.firstChild as HTMLElement,
        lerp: 0.125,
        wheelMultiplier: 0.75,
        touchMultiplier: 0.75,
        autoRaf: false,
      });
    }
  }, []);

  useEffect(() => {
    if (isMenuOpened) {
      lenisRef.current?.start();
    } else {
      lenisRef.current?.stop();
    }
  }, [isMenuOpened]);

  useTempus((time) => {
    if (lenisRef.current) {
      lenisRef.current?.raf(time);
    }
  });

  const { contextSafe } = useGSAP(() => {}, {
    scope: container,
  });

  useGSAP(
    () => {
      if (isMenuOpened) {
        const tl = gsap.timeline({
          defaults: {
            duration: 1.5,
            ease: expoOut,
          },
        });

        tl.set(container.current, {
          display: "block",
          clipPath: "inset(0% 0% 100% 0%)",
        }).fromTo(
          container.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.75,
          },
          0
        );
      }
    },
    {
      scope: container,
      dependencies: [isMenuOpened],
    }
  );

  const hideMenu = contextSafe(() => {
    const tl = gsap.timeline({
      defaults: {
        duration: 1.25,
        ease: expoOut,
      },
      onComplete: () => {
        gsap.set(container.current, {
          display: "none",
        });

        setIsMenuOpened(false);
      },
    });

    tl.fromTo(
      container.current,
      {
        clipPath: "inset(0% 0% 0% 0%)",
      },
      {
        clipPath: "inset(0% 0% 101% 0%)",
      },
      0
    );
  });

  return (
    <div
      className="fixed left-0 top-0 w-full h-dvh hidden bg-white text-black z-menu"
      ref={container}
    >
      <div
        className="relative overflow-x-clip overflow-y-scroll h-dvh scroll-wrapper"
        ref={scrollWrapper}
      >
        <div className="relative h-[150dvh] flex items-center p-grid">
          <button
            className="fixed top-grid right-grid text-s uppercase"
            onClick={hideMenu}
          >
            close
          </button>
          <p className="text-base">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad
            doloremque molestias enim neque, ab omnis officia, voluptatem at
            unde quis perspiciatis, maxime deleniti. Quae necessitatibus rem
            molestiae ab non vitae obcaecati repellat illo quia in repudiandae
            laboriosam deleniti praesentium rerum saepe unde illum eveniet omnis
            sequi, consectetur, alias laborum? Quo obcaecati minima ipsum
            consequatur, numquam repellat veritatis, quidem magnam nihil odit
            commodi voluptas eveniet excepturi? Saepe blanditiis cum eos maiores
            assumenda dolor quam pariatur consectetur rem sint nostrum porro
            fuga necessitatibus obcaecati praesentium, beatae sapiente ipsum
            error provident molestiae nemo voluptates laboriosam at! Dolorem
            esse ducimus repellendus recusandae dignissimos, nam autem quae id
            omnis dolores corporis temporibus iure sed architecto officia
            facilis natus exercitationem quidem neque nostrum provident dolor
            doloremque?
          </p>
        </div>
      </div>
    </div>
  );
}
