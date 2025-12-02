import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { Home, About, Settings } from "@/sanity/sanity.types";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  return builder.image(source);
}

export async function getHomePageData(): Promise<Home> {
  return await client.fetch(`*[_type == "home"][0]{
    content[]{
      _type,
      _key,
      ...
    },
    seo,
    settings
  }`);
}

export async function getAboutPageData(): Promise<About> {
  return await client.fetch(`*[_type == "about"][0]{
    content[]{
      _type,
      _key,
      ...
    },
    seo,
    settings
  }`);
}

export async function getSeoData(): Promise<Settings> {
  return await client.fetch(`*[_type == "settings"][0]{
    fallbackSEO
  }`);
}
