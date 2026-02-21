"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { getOffset } from "@/libs/utils";
import type { Accordion as AccordionType } from "@/sanity/sanity.types";

interface AccordionItemProps {
  label: string;
  content: string;
}

export function Accordion({ items }: Pick<AccordionType, "items">) {
  if (!items?.length) return null;

  return (
    <div className="px-grid pt-40 pb-80">
      {items.map((item) => (
        <AccordionItem
          key={item._key}
          label={item.label ?? ""}
          content={item.content ?? ""}
        />
      ))}
    </div>
  );
}

function AccordionItem({ label, content }: AccordionItemProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const { contextSafe } = useGSAP({ scope: detailsRef });

  const handleToggle = contextSafe((e: React.MouseEvent) => {
    e.preventDefault();
    if (isAnimating.current) return;
    detailsRef.current?.hasAttribute("open") ? close() : open();
  });

  const close = contextSafe(() => {
    const details = detailsRef.current;
    const summary = summaryRef.current;
    const content = contentRef.current;
    if (!details || !summary || !content) return;

    isAnimating.current = true;
    setIsOpen(false);

    const { height: startHeight } = getOffset(details);
    const { height: endHeight } = getOffset(summary);

    gsap.fromTo(
      details,
      { height: startHeight },
      {
        height: endHeight,
        duration: 0.6,
        ease: "expo.out",
        onComplete: () => {
          details.removeAttribute("open");
          details.style.height = "";
          isAnimating.current = false;
        },
      },
    );
  });

  const open = contextSafe(() => {
    const details = detailsRef.current;
    const summary = summaryRef.current;
    const content = contentRef.current;
    if (!details || !summary || !content) return;

    isAnimating.current = true;
    setIsOpen(true);

    const { height: startHeight } = getOffset(details);
    const { height: summaryHeight } = getOffset(summary);
    const { height: contentHeight } = getOffset(content);

    details.setAttribute("open", "");

    gsap.fromTo(
      details,
      { height: startHeight },
      {
        height: summaryHeight + contentHeight,
        duration: 0.6,
        ease: "expo.out",
        onComplete: () => {
          details.style.height = "";
          isAnimating.current = false;
        },
      },
    );
  });

  return (
    <details ref={detailsRef} className="border-b overflow-clip">
      <summary
        ref={summaryRef}
        onClick={handleToggle}
        className="list-none py-8"
      >
        <div className="relative flex items-center justify-between cursor-pointer">
          <span className="text-s uppercase tracking-widest">{label}</span>
          <span className="relative w-[1.2rem] h-[1.2rem]">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-white" />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-white transition-transform duration-[0.4s]"
              style={{
                transitionTimingFunction: "ease-in-out",
                transform: isOpen ? "scaleY(0)" : "scaleY(1)",
              }}
            />
          </span>
        </div>
      </summary>
      <div ref={contentRef} className="pb-[3.2rem] pt-[1.6rem]">
        <p className="text-base text-white/60 max-w-col-8">{content}</p>
      </div>
    </details>
  );
}
