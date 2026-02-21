import React from "react";

import type { Hero as HeroType } from "@/sanity/sanity.types";

export function Hero(data: HeroType) {
  if (!data) return null;

  const { subtitle, titleLeft, titleRight } = data;

  return (
    <section className="w-full h-dvh flex flex-col justify-center gap-40 p-grid">
      {subtitle && (
        <p className="text-xs ml-col-6-gap">
          {subtitle.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < subtitle.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
          <br />
        </p>
      )}
      <header>
        <h1 className="text-heading-l font-bold uppercase flex flex-col">
          <span>{titleLeft}</span>
          <span className="ml-col-6-gap">{titleRight}</span>
        </h1>
      </header>
    </section>
  );
}
