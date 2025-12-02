import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { CSSProperties, Ref } from "react";
import cn from "clsx";

export type ImageProps = Omit<NextImageProps, "objectFit"> & {
  objectFit?: CSSProperties["objectFit"];
  ref?: Ref<HTMLImageElement>;
  width?: number;
  height?: number;
  sizes?: string;
};

export function Image({
  objectFit = "cover",
  alt = "",
  ref,
  width,
  height,
  loading = "lazy",
  quality = 90,
  style,
  className,
  src,
  unoptimized,
  priority,
  sizes = "100vw",
  ...props
}: ImageProps) {
  if (!src) return null;

  const isSvg = typeof src === "string" && src.includes(".svg");

  return (
    <NextImage
      ref={ref}
      fill
      width={width}
      height={height}
      loading={loading}
      quality={quality}
      alt={alt}
      style={{ objectFit, ...style }}
      className={cn("image", className)}
      src={src}
      unoptimized={unoptimized || isSvg}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      priority={priority}
      sizes={sizes}
      {...props}
    />
  );
}
