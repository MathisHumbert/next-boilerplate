"use client";

import { useEffect, useRef, useState } from "react";
import Core, { CoreConfig } from "smooothy";
import { useTempus } from "tempus/react";

export function useSmooothy(config: Partial<CoreConfig> = {}) {
  const sliderRef = useRef<HTMLElement | null>(null);
  const instanceRef = useRef<Core | null>(null);
  const [slider, setSlider] = useState<Core | null>(null);

  const refCallback = (node: HTMLElement | null) => {
    if (node && !slider) {
      instanceRef.current = new Core(node, config);
      setSlider(instanceRef.current);
    }
    sliderRef.current = node;
  };

  useTempus(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  });

  useEffect(() => {
    return () => {
      if (slider) {
        slider.destroy();
      }
    };
  }, [slider]);

  return { ref: refCallback, slider };
}
