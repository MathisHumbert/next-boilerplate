import type { HeadingText as HeadingTextType } from "@/sanity/sanity.types";

export function HeadingText(data: HeadingTextType) {
  if (!data) return null;

  const { heading, subtitle, text } = data;

  return (
    <section className="w-full h-dvh flex flex-col justify-between p-grid ">
      <h2 className="text-heading">{heading}</h2>
      <div className="flex flex-col gap-[1.2rem] ml-col-6-gap w-col-4">
        <h4 className="text-l">{subtitle}</h4>
        <p className="text-s">{text}</p>
      </div>
    </section>
  );
}
