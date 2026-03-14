"use client";

import { Link } from "next-transition-router";
import { useState } from "react";

import { useSmooothy } from "@/hooks/use-smooothy";
import { SanityImage } from "@/components/sanity-image";
import type { Slider as SliderType } from "@/sanity/sanity.types";

export function LinkSlider(data: SliderType) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { ref, slider } = useSmooothy({
    infinite: false,
    link: true,
    keyboard: true,
    lerpFactor: 0.2,
    setOffset: ({ wrapperWidth }) => {
      return wrapperWidth;
    },
    onSlideChange: (current, prev) => {
      setCurrentSlide(current);
    },
  });

  if (!data) return null;

  const { images } = data;

  return (
    <section className="w-full flex flex-col gap-8 p-grid">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase">Slider</h2>
        <div className="flex gap-4">
          <button
            onClick={() => slider?.goToPrev()}
            className="text-xs uppercase disabled:opacity-30"
            disabled={currentSlide === 0}
          >
            Prev
          </button>
          <button
            onClick={() => slider?.goToNext()}
            className="text-xs uppercase disabled:opacity-30"
            disabled={currentSlide === images?.length! - 4}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex overflow-hidden" ref={ref}>
        {images &&
          images.map((item, index) => (
            <div className="relative w-col-3-gap shrink-0 ] pr-8" key={index}>
              <Link href="/about" className="flex flex-col gap-[1.2rem]">
                <figure className="relative w-full aspect-square">
                  {item.image?.asset && (
                    <SanityImage
                      image={item.image}
                      alt={item.alt || ""}
                      sizes="33vw"
                    />
                  )}
                </figure>
                <p className="text-xs uppercase">Lorem.</p>
                <p className="text-s">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Culpa iure voluptatibus iusto? Vitae, asperiores.
                </p>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
}
