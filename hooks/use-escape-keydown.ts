"use client";

import { useEffect } from "react";

export function useEscapeKeydown(
  onEscapeKeydown: (event: KeyboardEvent) => void,
  disabled?: boolean,
) {
  useEffect(() => {
    if (disabled) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscapeKeydown(event);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onEscapeKeydown, disabled]);
}
