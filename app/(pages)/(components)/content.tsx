import { Hero } from "@/app/(pages)/(components)/hero";
import { Slider } from "@/app/(pages)/(components)/slider";
import { HeadingText } from "@/app/(pages)/(components)/heading-text";

import type {
  Hero as HeroType,
  HeadingText as HeadingTextType,
  Slider as SliderType,
} from "@/sanity/sanity.types";

type ContentComponent = (HeroType | HeadingTextType | SliderType) & {
  _key: string;
};

interface ContentProps {
  data: ContentComponent;
  index?: number;
}

export function Content({ data, index }: ContentProps) {
  if (!data || !data._type) {
    return null;
  }

  switch (data._type) {
    case "hero":
      return <Hero key={data._key || index} {...data} />;
    case "heading-text":
      return <HeadingText key={data._key || index} {...data} />;
    case "slider":
      return <Slider key={data._key || index} {...data} />;
    default:
      return null;
  }
}
