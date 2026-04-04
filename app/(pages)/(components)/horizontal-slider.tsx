"use client";

import { useRef, useState } from "react";

import { useSmooothy } from "@/hooks/use-smooothy";
import { SanityImage } from "@/components/sanity-image";
import type { Slider as SliderType } from "@/sanity/sanity.types";
import { useHorizontalDrag } from "@/hooks/use-horizontal-drag";

export function HorizontalSlider(data: SliderType) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const horizontalWrapperRef = useRef<HTMLDivElement | null>(null);
  const horizontalContentRef = useRef<HTMLDivElement | null>(null);

  if (!data) return null;

  const { images } = data;

  const { scrollToIndex, scrollToNext, scrollToPrev } = useHorizontalDrag({
    wrapperRef: horizontalWrapperRef,
    contentRef: horizontalContentRef,
    onProgress: (progress, index) => {
      console.log(index);
      if (currentSlide !== index) {
        setCurrentSlide(index);
      }
    },
  });

  return (
    <section className="p-grid flex w-full flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="body-xs uppercase">Slider</h2>
        <div className="flex gap-4">
          <button
            onClick={() => scrollToPrev()}
            className="body-xs uppercase disabled:opacity-30"
            disabled={currentSlide === 0}
          >
            Prev
          </button>
          <button
            onClick={() => scrollToNext()}
            className="body-xs uppercase disabled:opacity-30"
            disabled={currentSlide === images?.length! - 1}
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-clip" ref={horizontalWrapperRef}>
        <div className="gap-gutter flex" ref={horizontalContentRef}>
          {images &&
            images.map((item, index) => (
              <div
                className="w-col-gap-3 relative flex shrink-0 flex-col gap-[1.2rem]"
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
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Culpa iure voluptatibus iusto? Vitae, asperiores.
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
