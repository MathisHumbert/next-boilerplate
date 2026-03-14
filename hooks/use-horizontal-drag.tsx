import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

import { clamp, lerp } from "@/libs/utils";
import { $isMobile, $isPageVisible } from "@/store/global";
import { useStore } from "@nanostores/react";

interface UseHorizontalDragProps {
  wrapperRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  speed?: number;
  keyboard?: boolean;
  wheelScroll?: boolean;
  wheelSpeed?: number;
  onProgress?: (progress: number, index: number) => void;
}

export function useHorizontalDrag({
  wrapperRef,
  contentRef,
  enabled = true,
  speed = 1.5,
  keyboard = true,
  wheelScroll = false,
  wheelSpeed = 1,
  onProgress,
}: UseHorizontalDragProps) {
  const scroll = useRef({
    current: 0,
    target: 0,
    position: 0,
    start: 0,
    limit: 0,
    progress: 0,
    index: 0,
  });
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
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

  const scrollToNext = useCallback(() => {
    const content = contentRef.current;

    if (!content) return;

    const items = [...content.children] as HTMLElement[];
    const next = items.find(
      (item) => item.offsetLeft > scroll.current.current + 1,
    );

    if (next) scroll.current.target = next.offsetLeft;
  }, [contentRef]);

  const scrollToPrev = useCallback(() => {
    const content = contentRef.current;

    if (!content) return;

    const items = [...content.children] as HTMLElement[];
    const prev = [...items]
      .reverse()
      .find((item) => item.offsetLeft < scroll.current.current - 1);

    if (prev) scroll.current.target = prev.offsetLeft;
  }, [contentRef]);

  useEffect(() => {
    if (!enabled || !isPageVisible) return;

    const content = contentRef.current;
    const wrapper = wrapperRef.current;

    if (!content || !wrapper) return;

    const linkCleanups: (() => void)[] = [];

    [...content.querySelectorAll<HTMLAnchorElement>("a")].forEach((item) => {
      let startX = 0;
      let startY = 0;
      let startTime = 0;
      let dragging = false;

      item.style.pointerEvents = "none";

      const parent = item.parentElement!;

      const onDown = (e: MouseEvent) => {
        startX = e.clientX;
        startY = e.clientY;
        startTime = Date.now();
        dragging = false;
      };

      const onMove = (e: MouseEvent) => {
        if (
          Math.abs(e.clientX - startX) > 5 ||
          Math.abs(e.clientY - startY) > 5
        ) {
          dragging = true;
        }
      };

      const onUp = () => {
        if (!dragging && Date.now() - startTime < 200) item.click();
        startTime = 0;
        dragging = false;
      };

      parent.addEventListener("mousedown", onDown);
      parent.addEventListener("mousemove", onMove);
      parent.addEventListener("mouseup", onUp);

      linkCleanups.push(() => {
        parent.removeEventListener("mousedown", onDown);
        parent.removeEventListener("mousemove", onMove);
        parent.removeEventListener("mouseup", onUp);
        item.style.pointerEvents = "";
      });
    });

    const handleTouchStart = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      hasMoved.current = false;
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
        if (target.closest("button")) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }

      hasMoved.current = false;
    };

    let isHovered = false;

    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!wheelScroll || scroll.current.limit === 0) return;

      e.preventDefault();
      scroll.current.target += (e.deltaY + e.deltaX) * wheelSpeed;
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (!isHovered) return;

      const step = wrapper.clientWidth * 0.8;

      switch (e.key) {
        case "ArrowLeft":
          scroll.current.target -= step;
          break;
        case "ArrowRight":
          scroll.current.target += step;
          break;
      }
    };

    let itemCount = content.children.length;

    const handleResize = () => {
      if (!content || !wrapper) return;

      const contentWidth = content.scrollWidth;
      const wrapperWidth = wrapper.clientWidth;

      scroll.current.limit = Math.max(0, contentWidth - wrapperWidth);
      itemCount = content.children.length;

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

    let lastCurrent = -1;

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

      if (scroll.current.current !== lastCurrent) {
        lastCurrent = scroll.current.current;

        const progress = scroll.current.limit > 0 ? scroll.current.current / scroll.current.limit : 0;
        const index = Math.round(progress * (itemCount - 1));

        scroll.current.progress = progress;
        scroll.current.index = index;
        onProgressRef.current?.(progress, index);
      }

      content.style.transform = `translate3d(${-scroll.current.current}px, 0, 0)`;
    };

    gsap.ticker.add(update);

    handleResize();
    resizeObserver.observe(content);

    wrapper.addEventListener("mouseenter", handleMouseEnter);
    wrapper.addEventListener("mouseleave", handleMouseLeave);
    wrapper.addEventListener("mousedown", handleTouchStart);
    wrapper.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    wrapper.addEventListener("click", handleClick, true);

    window.addEventListener("mousemove", handleTouchMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("mouseup", handleTouchEnd);
    window.addEventListener("mouseleave", handleTouchEnd);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    window.addEventListener("resize", handleResize);
    if (keyboard) window.addEventListener("keydown", handleKeydown);
    if (wheelScroll)
      wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      gsap.ticker.remove(update);
      resizeObserver.disconnect();
      linkCleanups.forEach((fn) => fn());
      wrapper.removeEventListener("mouseenter", handleMouseEnter);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
      wrapper.removeEventListener("mousedown", handleTouchStart);
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("click", handleClick, true);

      window.removeEventListener("mousemove", handleTouchMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleTouchEnd);
      window.removeEventListener("mouseleave", handleTouchEnd);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      if (keyboard) window.removeEventListener("keydown", handleKeydown);
      if (wheelScroll) wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [
    wrapperRef,
    contentRef,
    enabled,
    speed,
    keyboard,
    wheelScroll,
    wheelSpeed,
    isMobile,
    isPageVisible,
  ]);

  return {
    scroll: scroll.current,
    isDragging: isDragging.current,
    scrollTo,
    scrollToIndex,
    scrollToNext,
    scrollToPrev,
  };
}
