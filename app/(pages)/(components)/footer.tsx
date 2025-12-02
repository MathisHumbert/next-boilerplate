import { Link as TransitionLink } from "next-transition-router";

import type { PageSettings } from "@/sanity/sanity.types";
import { LineReveal } from "../(animations)/line-reveal";

interface FooterProps {
  nextPage?: PageSettings["footerPage"];
}

export function Footer({ nextPage }: FooterProps) {
  const getHref = () => {
    if (!nextPage?._ref) return "/";
    return nextPage._ref === "home" ? "/" : `/${nextPage._ref}`;
  };

  const getLabel = () => {
    if (!nextPage?._ref) return "Home";
    return nextPage._ref === "home" ? "Home" : "About";
  };

  return (
    <footer className="relative flex gap-grid py-48 px-grid">
      <LineReveal>
        <span className="absolute top-0 left-grid w-[calc(100%-var(--grid-margin)*2)] h-px bg-current" />
      </LineReveal>
      <p className="text-xs uppercase w-col-1">Next Page</p>
      <TransitionLink
        href={getHref()}
        scroll={false}
        className="text-xs uppercase ml-col-2-gap"
      >
        {getLabel()}
      </TransitionLink>
    </footer>
  );
}
