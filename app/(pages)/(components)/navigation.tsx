"use client";

import { Link as TransitionLink } from "next-transition-router";

import { $isMenuOpened } from "@/store/global";

export function Navigation() {
  return (
    <nav className="p-grid z-navigation pointer-events-none fixed top-0 left-0 w-full">
      <ul className="gap-grid flex">
        <li className="w-col-1">
          <TransitionLink
            href="/"
            scroll={false}
            className="pointer-events-auto p-0 text-xs uppercase"
          >
            Home
          </TransitionLink>
        </li>
        <li className="w-col-1">
          <TransitionLink
            href="/about"
            scroll={false}
            className="pointer-events-auto p-0 text-xs uppercase"
          >
            About
          </TransitionLink>
        </li>
        <li className="w-col-1">
          <button
            className="pointer-events-auto p-0 text-xs uppercase"
            onClick={() => $isMenuOpened.set(true)}
          >
            Menu
          </button>
        </li>
      </ul>
    </nav>
  );
}
