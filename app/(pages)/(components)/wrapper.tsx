"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import cn from "clsx";

import { Footer } from "@/app/(pages)/(components)/footer";
import type { PageSettings } from "@/sanity/sanity.types";

type WrapperProps = {
  children: ReactNode;
  theme?: "dark" | "light";
  className?: string;
  footer?: boolean;
  nextPage?: PageSettings["footerPage"];

  [key: string]: any;
};

export function Wrapper({
  children,
  theme = "dark",
  className,
  footer = true,
  nextPage = {
    _ref: "home",
    _type: "reference",
  },
  ...props
}: WrapperProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [pathname, theme]);

  return (
    <div className={cn(className, "page")} {...props}>
      {children}
      {footer && <Footer nextPage={nextPage} />}
    </div>
  );
}
