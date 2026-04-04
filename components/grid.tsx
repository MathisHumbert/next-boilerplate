"use client";

import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";

import { $responsive } from "@/store/responsive";

export function Grid() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { gridCount } = useStore($responsive);

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
    <div className="gap-gutter px-grid z-grid pointer-events-none fixed top-0 left-0 flex h-dvh w-full max-w-[100vw] justify-center">
      {Array.from({ length: gridCount }, (_, index) => (
        <div key={index} className="bg-red-500/10 h-full w-full" />
      ))}
      <div className="bg-red-500/10 absolute top-1/2 left-0 h-8 w-full translate-y-[-50%]" />
    </div>
  );
}
