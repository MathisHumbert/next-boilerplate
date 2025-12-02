import { Image, ImageProps } from "@/components/image";
import { urlForImage } from "@/libs/sanity";
import type { CustomImage } from "@/sanity/sanity.types";

export type SanityImageProps = Omit<ImageProps, "src"> & {
  image: CustomImage["image"];
  alt?: string;
  maxWidth?: number;
};

export function SanityImage({
  image,
  alt,
  maxWidth = 1920,
  ...props
}: SanityImageProps) {
  if (!image?.asset) return null;

  return (
    <Image
      src={urlForImage(image).width(maxWidth).url()}
      alt={alt || ""}
      {...props}
    />
  );
}
