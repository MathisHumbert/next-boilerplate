import React from "react";

import type { Hero as HeroType } from "@/sanity/sanity.types";

export function Hero(data: HeroType) {
  if (!data) return null;

  const { subtitle, titleLeft, titleRight } = data;

  return (
    <section className="p-grid flex h-dvh w-full flex-col justify-center gap-40">
      {subtitle && (
        <p className="ml-col-gap-6 body-xs">
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
        <h1 className="heading-l flex flex-col font-bold uppercase">
          <span>{titleLeft}</span>
          <span className="ml-col-gap-6">{titleRight}</span>
        </h1>
      </header>
    </section>
  );
}
