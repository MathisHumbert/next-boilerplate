"use client";

import { useEffect, useRef, useState } from "react";
import Core, { CoreConfig } from "smooothy";
import gsap from "gsap";

interface UseSmooothyConfig extends Partial<CoreConfig> {
  link?: boolean;
  keyboard?: boolean;
}

function handleLinks(wrapper: HTMLElement) {
  const cleanups: (() => void)[] = [];

  [...wrapper.querySelectorAll<HTMLAnchorElement>("a")].forEach((item) => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isDragging = false;

    item.style.pointerEvents = "none";

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
      isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!startTime) return;
      if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
        isDragging = true;
      }
    };

    const handleMouseUp = () => {
      if (!isDragging && Date.now() - startTime < 200) {
        item.click();
      }
      startTime = 0;
      isDragging = false;
    };

    const parent = item.parentElement!;
    parent.addEventListener("mousedown", handleMouseDown);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseup", handleMouseUp);

    cleanups.push(() => {
      parent.removeEventListener("mousedown", handleMouseDown);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseup", handleMouseUp);
      item.style.pointerEvents = "";
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

function handleKeyboard(instance: Core) {
  const onKeydown = (e: KeyboardEvent) => {
    if (!instance.isVisible) return;

    if (/^[0-9]$/.test(e.key)) {
      const index = parseInt(e.key);
      if (!instance.config.infinite && index > instance.items.length - 1) return;
      instance.goToIndex(index);
      return;
    }

    switch (e.key) {
      case "ArrowLeft":
        instance.goToPrev();
        break;
      case "ArrowRight":
      case " ":
        instance.goToNext();
        break;
    }
  };

  window.addEventListener("keydown", onKeydown);
  return () => window.removeEventListener("keydown", onKeydown);
}

export function useSmooothy({ link, keyboard, ...config }: UseSmooothyConfig = {}) {
  const sliderRef = useRef<HTMLElement | null>(null);
  const [slider, setSlider] = useState<Core | null>(null);

  const refCallback = (node: HTMLElement | null) => {
    if (node && !slider) {
      const instance = new Core(node, config);
      gsap.ticker.add(instance.update.bind(instance));
      setSlider(instance);
    }
    sliderRef.current = node;
  };

  useEffect(() => {
    if (!slider || !link) return;
    return handleLinks(slider.wrapper);
  }, [slider, link]);

  useEffect(() => {
    if (!slider || !keyboard) return;
    return handleKeyboard(slider);
  }, [slider, keyboard]);

  useEffect(() => {
    return () => {
      if (slider) {
        gsap.ticker.remove(slider.update.bind(slider));
        slider.destroy();
      }
    };
  }, [slider]);

  return { ref: refCallback, slider };
}
