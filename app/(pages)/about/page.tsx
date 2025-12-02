import { notFound } from "next/navigation";
import { Metadata } from "next";

import { Content } from "@/app/(pages)/(components)/content";
import { Wrapper } from "@/app/(pages)/(components)/wrapper";
import { getAboutPageData, urlForImage } from "@/libs/sanity";
import type { About as AboutType } from "@/sanity/sanity.types";

export default async function About() {
  const data: AboutType = await getAboutPageData();

  if (!data) {
    return notFound();
  }

  return (
    <Wrapper
      className="about"
      theme={data.settings?.theme || "light"}
      footer={data.settings?.showFooter || true}
    >
      {data?.content?.map((item, index) => (
        <Content key={item._key || index} data={item} index={index} />
      ))}
    </Wrapper>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPageData();

  const metadata: Metadata = {};

  if (!data) {
    return metadata;
  }

  if (data.seo?.metaTitle) {
    metadata.title = data.seo.metaTitle;
  }

  if (data.seo?.metaDescription) {
    metadata.description = data.seo.metaDescription;
  }

  if (data.seo?.ogImage?.asset) {
    metadata.openGraph = {
      title: data.seo?.metaTitle,
      description: data.seo?.metaDescription,
      images: [
        {
          url: urlForImage(data.seo.ogImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: data.seo.ogImage.alt || "",
        },
      ],
    };
  }

  return metadata;
}
