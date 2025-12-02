"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";

import { debounce } from "@/libs/utils";

type WindowSize = {
  width: number;
  height: number;
};

type EventCallback = (event: any) => void;
type ResizeCallback = (size: WindowSize) => void;

type WindowEventsContextType = {
  windowSize: WindowSize;
  addEventCallback: (
    eventType: string,
    callback: EventCallback | ResizeCallback
  ) => () => void;
};

const WindowEventsContext = createContext<WindowEventsContextType | null>(null);

export function WindowEventsProvider({ children }: { children: ReactNode }) {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const callbacksRef = useRef({
    resize: new Set<ResizeCallback>(),
    click: new Set<EventCallback>(),
    mousedown: new Set<EventCallback>(),
    mousemove: new Set<EventCallback>(),
    mouseup: new Set<EventCallback>(),
    touchstart: new Set<EventCallback>(),
    touchmove: new Set<EventCallback>(),
    touchend: new Set<EventCallback>(),
  });

  const addEventCallback = (
    eventType: string,
    callback: EventCallback | ResizeCallback
  ) => {
    if (callbacksRef.current[eventType as keyof typeof callbacksRef.current]) {
      callbacksRef.current[eventType as keyof typeof callbacksRef.current].add(
        callback as any
      );
      return () =>
        callbacksRef.current[
          eventType as keyof typeof callbacksRef.current
        ].delete(callback as any);
    }
    throw new Error(`Unsupported event type: ${eventType}`);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = debounce(() => {
      const newSize = { width: window.innerWidth, height: window.innerHeight };
      setWindowSize(newSize);
      callbacksRef.current.resize.forEach((callback) => callback(newSize));
    }, 100);

    const handleClick = (event: MouseEvent) => {
      callbacksRef.current.click.forEach((callback) => callback(event));
    };

    const handleMouseDown = (event: MouseEvent) => {
      callbacksRef.current.mousedown.forEach((callback) => callback(event));
    };

    const handleMouseMove = (event: MouseEvent) => {
      callbacksRef.current.mousemove.forEach((callback) => callback(event));
    };

    const handleMouseUp = (event: MouseEvent) => {
      callbacksRef.current.mouseup.forEach((callback) => callback(event));
    };

    const handleTouchStart = (event: TouchEvent) => {
      callbacksRef.current.touchstart.forEach((callback) => callback(event));
    };

    const handleTouchMove = (event: TouchEvent) => {
      callbacksRef.current.touchmove.forEach((callback) => callback(event));
    };

    const handleTouchEnd = (event: TouchEvent) => {
      callbacksRef.current.touchend.forEach((callback) => callback(event));
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    handleResize();

    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <WindowEventsContext.Provider value={{ windowSize, addEventCallback }}>
      {children}
    </WindowEventsContext.Provider>
  );
}

export function useWindowEvents(
  eventType: string,
  callback?: EventCallback | ResizeCallback
) {
  const context = useContext(WindowEventsContext);

  if (!context) {
    throw new Error(
      "useWindowEvents must be used within a WindowEventsProvider"
    );
  }

  const { windowSize, addEventCallback } = context;

  useEffect(() => {
    if (callback && eventType) {
      return addEventCallback(eventType, callback);
    }
  }, [eventType, callback, addEventCallback]);

  return windowSize;
}
