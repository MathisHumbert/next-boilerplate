import { Link as TransitionLink } from "next-transition-router";
import type { PageSettings } from "@/sanity/sanity.types";

import { TextReveal } from "../(animations)/text-reveal";

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
    <footer className="gap-grid px-grid relative flex py-48">
      <span
        data-scroll
        data-scroll-class="is-inview"
        data-animation="line"
        className="left-grid absolute top-0 h-px w-[calc(100%-var(--grid-margin)*2)] bg-current"
      />
      <TextReveal>
        <p className="w-col-1 text-xs uppercase">Next Page</p>
      </TextReveal>

      <TextReveal>
        <TransitionLink
          href={getHref()}
          scroll={false}
          className="ml-col-2-gap text-xs uppercase"
        >
          {getLabel()}
        </TransitionLink>
      </TextReveal>
    </footer>
  );
}
