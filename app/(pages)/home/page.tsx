import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Content } from "@/app/(pages)/(components)/content";
import { Wrapper } from "@/app/(pages)/(components)/wrapper";
import { getHomePageData, urlForImage } from "@/libs/sanity";
import type { Home as HomeType } from "@/sanity/sanity.types";

export default async function Home() {
  const data: HomeType = await getHomePageData();

  if (!data) {
    return notFound();
  }

  return (
    <Wrapper
      className="home"
      theme={data.settings?.theme || "light"}
      footer={data.settings?.showFooter || true}
      nextPage={data.settings?.footerPage}
    >
      {data?.content?.map((item, index) => (
        <Content key={item._key || index} data={item} index={index} />
      ))}
    </Wrapper>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData();

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
