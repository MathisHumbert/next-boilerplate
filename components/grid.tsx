"use client";

import { useState, useEffect } from "react";

import { useWindowEvents } from "@/libs/events";

export function Grid() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  useWindowEvents("resize", () => {
    const newCount = getCSSProperty("--grid-count");
    if (count !== newCount) {
      setCount(newCount);
    }
  });

  const getCSSProperty = (property: string): number => {
    return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(property)
    );
  };

  useEffect(() => {
    const initialCount = getCSSProperty("--grid-count");
    setCount(initialCount);
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "g") {
        setIsVisible((prev) => !prev);
      }
    };

    // if (process.env.NODE_ENV === "development") {
    //   setIsVisible((prev) => !prev);
    // }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 top-0 w-full max-w-[100vw] h-dvh flex justify-center gap-grid px-grid z-grid pointer-events-none">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="w-full h-full bg-red-10" />
      ))}
      <div className="absolute left-0 top-1/2 translate-y-[-50%] w-full h-8 bg-red-10" />
    </div>
  );
}
