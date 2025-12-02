"use client";

import { useStore } from "@/libs/store";
import { Link as TransitionLink } from "next-transition-router";

export function Navigation() {
  const { setIsMenuOpened } = useStore();

  return (
    <nav className="fixed left-0 top-0 w-full p-grid z-navigation pointer-events-none">
      <ul className="flex gap-grid">
        <li className="w-col-1 ">
          <TransitionLink
            href="/"
            scroll={false}
            className="text-xs uppercase p-0 pointer-events-auto"
          >
            Home
          </TransitionLink>
        </li>
        <li className="w-col-1">
          <TransitionLink
            href="/about"
            scroll={false}
            className="text-xs uppercase p-0 pointer-events-auto"
          >
            About
          </TransitionLink>
        </li>
        <li className="w-col-1">
          <button
            className="text-xs uppercase p-0 pointer-events-auto"
            onClick={() => setIsMenuOpened(true)}
          >
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}
