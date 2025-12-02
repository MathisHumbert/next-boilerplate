"use client";

import { useSmooothy } from "@/hooks/useSmooothy";
import { SanityImage } from "@/components/sanity-image";
import type { Slider as SliderType } from "@/sanity/sanity.types";

export function Slider(data: SliderType) {
  const { ref } = useSmooothy({
    infinite: true,
    snap: true,
  });

  if (!data) return null;

  const { images } = data;

  return (
    <section className="w-full flex flex-col gap-8 p-grid">
      <h2 className="text-xs uppercase">Slider</h2>
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex ml-col-3" ref={ref}>
          {images &&
            images.map((item, index) => (
              <div
                className="relative w-col-3-gap shrink-0 flex flex-col gap-[1.2rem] pl-8 pr-8"
                key={index}
              >
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
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
