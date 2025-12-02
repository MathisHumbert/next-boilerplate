import gsap from "gsap";
import EventEmitter from "events";

export const events = new EventEmitter();

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;

  const executedFunction = (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  executedFunction.cancel = () => {
    clearTimeout(timeout);
  };

  return executedFunction as T & { cancel: () => void };
}

export const getOffset = (element: HTMLElement, scroll: number = 0) => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width,
  };
};

export function clamp(min: number, max: number, number: number): number {
  return gsap.utils.clamp(min, max, number);
}

export function lerp(p1: number, p2: number, t: number): number {
  return gsap.utils.interpolate(p1, p2, t);
}

export function delay(s: number): Promise<void> {
  return new Promise((res) => gsap.delayedCall(s, res));
}
