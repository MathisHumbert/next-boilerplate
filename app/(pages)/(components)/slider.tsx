"use client";

import { useState } from "react";

import { useSmooothy } from "@/hooks/use-smooothy";
import { SanityImage } from "@/components/sanity-image";
import type { Slider as SliderType } from "@/sanity/sanity.types";

export function Slider(data: SliderType) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { ref, slider } = useSmooothy({
    infinite: false,
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
    <section className="p-grid flex w-full flex-col gap-8 select-none">
      <div className="flex items-center justify-between">
        <h2 className="body-xs uppercase">Slider</h2>
        <div className="flex gap-4">
          <button
            onClick={() => slider?.goToPrev()}
            className="body-xs uppercase disabled:opacity-30"
            disabled={currentSlide === 0}
          >
            Prev
          </button>
          <button
            onClick={() => slider?.goToNext()}
            className="body-xs uppercase disabled:opacity-30"
            disabled={currentSlide === images?.length! - 4}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex overflow-hidden" ref={ref}>
        {images &&
          images.map((item, index) => (
            <div
              className="w-col-gap-3 relative flex shrink-0 flex-col gap-[1.2rem] pr-8"
              key={index}
            >
              <figure className="relative aspect-square w-full">
                {item.image?.asset && (
                  <SanityImage
                    image={item.image}
                    alt={item.alt || ""}
                    sizes="33vw"
                  />
                )}
              </figure>
              <p className="body-xs uppercase">Lorem.</p>
              <p className="body-s">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa
                iure voluptatibus iusto? Vitae, asperiores.
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
