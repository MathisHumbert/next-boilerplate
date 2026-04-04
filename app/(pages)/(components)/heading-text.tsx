import type { HeadingText as HeadingTextType } from "@/sanity/sanity.types";

export function HeadingText(data: HeadingTextType) {
  if (!data) return null;

  const { heading, subtitle, text } = data;

  return (
    <section className="p-grid flex h-dvh w-full flex-col justify-between">
      <h2 className="heading">{heading}</h2>
      <div className="ml-col-gap-6 w-col-4 flex flex-col gap-[1.2rem]">
        <h4 className="body-l">{subtitle}</h4>
        <p className="body-s">{text}</p>
      </div>
    </section>
  );
}
