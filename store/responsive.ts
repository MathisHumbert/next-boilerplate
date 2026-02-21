import { atom } from "nanostores";

export type ResponsiveValues = {
  screen: { width: number; height: number };
  fontSize: number;
  isMobile: boolean;
  gridMargin: number;
  gridGutter: number;
  gridCount: number;
  gridColumnWidth: number;
  gridWidth: number;
};

const MULTIPLIER = 10;

const SERVER_SNAPSHOT: ResponsiveValues = {
  screen: { width: 0, height: 0 },
  fontSize: 0,
  isMobile: false,
  gridMargin: 0,
  gridGutter: 0,
  gridCount: 0,
  gridColumnWidth: 0,
  gridWidth: 0,
};

function getCSSVar(prop: string): number {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(prop),
  );
}

function calculate(): ResponsiveValues {
  const breakpointMd = getCSSVar("--breakpoint-md");
  const sizesMobile = getCSSVar("--sizes-mobile");
  const sizesDesktop = getCSSVar("--sizes-desktop");

  const screen = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const isMobile = screen.width < breakpointMd;
  const size = isMobile ? sizesMobile : sizesDesktop;
  const fontSize = (screen.width / size) * MULTIPLIER;

  return {
    screen,
    fontSize,
    isMobile,
    gridMargin: getCSSVar("--grid-margin"),
    gridGutter: getCSSVar("--grid-gutter"),
    gridCount: getCSSVar("--grid-count"),
    gridColumnWidth: getCSSVar("--grid-column-width"),
    gridWidth: getCSSVar("--grid-width"),
  };
}

export const $responsive = atom<ResponsiveValues>(SERVER_SNAPSHOT);

if (typeof window !== "undefined") {
  $responsive.set(calculate());

  window.addEventListener("resize", () => {
    $responsive.set(calculate());
  });
}
