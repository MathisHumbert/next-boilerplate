import { atom, computed } from "nanostores";
import type LocomotiveScroll from "locomotive-scroll";

export type DeviceType = "phone" | "tablet" | "desktop";

export const $isMenuOpened = atom<boolean>(false);
export const $isPageVisible = atom<boolean>(false);
export const $locomotive = atom<LocomotiveScroll | null>(null);
export const $areFontsLoaded = atom<boolean>(false);
export const $isAppMounted = atom<boolean>(false);
export const $deviceType = atom<DeviceType>("desktop");
export const $isMobile = computed($deviceType, (type) => type !== "desktop");

export function initDeviceType() {
  const ua = navigator.userAgent;
  const isPhone = /Mobi|iPhone|iPod/i.test(ua);
  const isTablet =
    /iPad/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) ||
    (/Android/i.test(ua) && !/Mobi/i.test(ua));

  const type: DeviceType = isPhone ? "phone" : isTablet ? "tablet" : "desktop";

  $deviceType.set(type);
  document.documentElement.classList.add(
    type !== "desktop" ? "mobile" : "desktop",
  );
}
