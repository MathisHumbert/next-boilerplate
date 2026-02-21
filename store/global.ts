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
