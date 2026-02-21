"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import cn from "clsx";
import { ScrollTrigger } from "gsap/all";

import { Footer } from "@/app/(pages)/(components)/footer";
import type { PageSettings } from "@/sanity/sanity.types";
import LocomotiveScroll from "locomotive-scroll";
import { useStore } from "@nanostores/react";
import { $locomotive, $isPageVisible, $isAppMounted } from "@/store/global";

type WrapperProps = {
  children: ReactNode;
  theme?: "dark" | "light";
  className?: string;
  footer?: boolean;
  nextPage?: PageSettings["footerPage"];
  orientation?: "vertical" | "horizontal";
  [key: string]: any;
};

export function Wrapper({
  children,
  theme = "dark",
  className,
  footer = true,
  nextPage = {
    _ref: "home",
    _type: "reference",
  },
  orientation = "vertical",
  ...props
}: WrapperProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);
  const pathname = usePathname();
  const isPageVisible = useStore($isPageVisible);
  const isAppMounted = useStore($isAppMounted);

  useEffect(() => {
    if (scrollRef.current) {
      const wrapper = document.getElementById("scroll-wrapper") as HTMLElement;
      const content = document.getElementById("scroll-content") as HTMLElement;

      locomotiveScrollRef.current = new LocomotiveScroll({
        autoStart: false,
        lenisOptions: {
          wrapper,
          content,
          lerp: 0.125,
          wheelMultiplier: 0.75,
          touchMultiplier: 0.75,
          orientation,
        },
      });

      locomotiveScrollRef.current?.lenisInstance?.on(
        "scroll",
        ScrollTrigger.update,
      );
      ScrollTrigger.scrollerProxy(wrapper, {
        scrollTop(value?: number) {
          if (value !== undefined) {
            locomotiveScrollRef.current!.scrollTo(value);
          }
          return locomotiveScrollRef.current?.lenisInstance?.scroll || 0;
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

      $locomotive.set(locomotiveScrollRef.current);
    }

    return () => {
      locomotiveScrollRef.current?.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  useEffect(() => {
    if (!locomotiveScrollRef.current || !isAppMounted) return;

    if (isPageVisible) {
      locomotiveScrollRef.current?.start();
    } else {
      locomotiveScrollRef.current?.stop();
    }
  }, [isPageVisible]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [pathname, theme]);

  return (
    <div ref={scrollRef} className={cn(className, "page")} {...props}>
      {children}
      {footer && <Footer nextPage={nextPage} />}
    </div>
  );
}
