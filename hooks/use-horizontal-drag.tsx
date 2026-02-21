import { useCallback, useEffect, useRef } from "react";
import Tempus from "tempus";

import { clamp, lerp } from "@/libs/utils";
import { $isMobile, $isPageVisible } from "@/store/global";
import { useStore } from "@nanostores/react";

interface UseHorizontalDragProps {
  wrapperRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  speed?: number;
}

export function useHorizontalDrag({
  wrapperRef,
  contentRef,
  enabled = true,
  speed = 1.5,
}: UseHorizontalDragProps) {
  const scroll = useRef({
    current: 0,
    target: 0,
    position: 0,
    start: 0,
    limit: 0,
  });
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const startElement = useRef<HTMLElement | null>(null);
  const isMobile = useStore($isMobile);
  const isPageVisible = useStore($isPageVisible);

  const scrollTo = useCallback(
    (value: number) => {
      const content = contentRef.current;
      const wrapper = wrapperRef.current;

      if (!content || !wrapper) return;

      scroll.current.target = value;
    },
    [contentRef, wrapperRef],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const content = contentRef.current;
      const wrapper = wrapperRef.current;

      if (!content || !wrapper) return;

      const item = content.children[index] as HTMLElement | undefined;

      if (!item) return;

      scroll.current.target = item.offsetLeft;
    },
    [contentRef, wrapperRef],
  );

  useEffect(() => {
    if (!enabled || !isPageVisible) return;

    const content = contentRef.current;
    const wrapper = wrapperRef.current;

    if (!content || !wrapper) return;

    const handleTouchStart = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;

      if (!isMobile) {
        if (target.closest("a")) {
          e.preventDefault();
        }
      }

      isDragging.current = true;
      hasMoved.current = false;
      startElement.current = target;
      scroll.current.position = scroll.current.current;

      if (scroll.current.limit > 0) {
        wrapper.style.cursor = "grabbing";
      }

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      scroll.current.start = clientX;
    };

    const handleTouchMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      if (!isMobile) {
        e.preventDefault();
      }

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const distance = (scroll.current.start - clientX) * speed;

      if (Math.abs(scroll.current.start - clientX) > 5) {
        hasMoved.current = true;
      }

      scroll.current.target = scroll.current.position + distance;
    };

    const handleDragStart = (e: DragEvent) => {
      if (!isMobile) {
        const target = e.target as HTMLElement;
        if (target.closest("a")) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: MouseEvent | TouchEvent) => {
      if (!isMobile && hasMoved.current) {
        e.preventDefault();
        e.stopPropagation();
      }

      isDragging.current = false;

      if (scroll.current.limit > 0) {
        wrapper.style.cursor = "grab";
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!isMobile && hasMoved.current) {
        const target = e.target as HTMLElement;
        const link = target.closest("a");
        const button = target.closest("button");
        if (link || button) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }

      hasMoved.current = false;
      startElement.current = null;
    };

    const handleResize = () => {
      if (!content || !wrapper) return;

      const contentWidth = content.scrollWidth;
      const wrapperWidth = wrapper.clientWidth;

      scroll.current.limit = Math.max(0, contentWidth - wrapperWidth);

      wrapper.style.cursor = scroll.current.limit > 0 ? "grab" : "";

      if (scroll.current.target > scroll.current.limit) {
        scroll.current.target = scroll.current.limit;
      }

      if (scroll.current.current > scroll.current.limit) {
        scroll.current.current = scroll.current.limit;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

    const update = (_: number, deltaTime: number) => {
      scroll.current.target = clamp(
        0,
        scroll.current.limit,
        scroll.current.target,
      );
      scroll.current.current = lerp(
        scroll.current.current,
        scroll.current.target,
        easeOutSine(deltaTime * 0.006),
      );
      scroll.current.current = Number(scroll.current.current.toFixed(2));

      if (Math.abs(scroll.current.current - scroll.current.target) < 0.1) {
        scroll.current.current = scroll.current.target;
      }

      content.style.transform = `translate3d(${-scroll.current
        .current}px, 0, 0)`;
    };

    Tempus.add(update);

    handleResize();
    resizeObserver.observe(content);

    wrapper.addEventListener("mousedown", handleTouchStart);
    wrapper.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    wrapper.addEventListener("dragstart", handleDragStart);
    wrapper.addEventListener("click", handleClick, true);

    window.addEventListener("mousemove", handleTouchMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("mouseup", handleTouchEnd);
    window.addEventListener("mouseleave", handleTouchEnd);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      wrapper.removeEventListener("mousedown", handleTouchStart);
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("dragstart", handleDragStart);
      wrapper.removeEventListener("click", handleClick, true);

      window.removeEventListener("mousemove", handleTouchMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleTouchEnd);
      window.removeEventListener("mouseleave", handleTouchEnd);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [wrapperRef, contentRef, enabled, speed, isMobile, isPageVisible]);

  return {
    scroll: scroll.current,
    isDragging: isDragging.current,
    scrollTo,
    scrollToIndex,
  };
}
