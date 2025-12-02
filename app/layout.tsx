import { ReactTempus } from "tempus/react";

import { GSAP } from "@/components/gsap";
import { StoreProvider } from "@/libs/store";
import { WindowEventsProvider } from "@/libs/events";
import { Grid } from "@/components/grid";
import { Stats } from "@/components/stats";
import { Preloader } from "@/components/preloader";
import { Transition } from "@/components/transition";
import { Navigation } from "@/app/(pages)/(components)/navigation";
import { ScrollWrapper } from "@/app/(pages)/(components)/scroll-wrapper";
import { Menu } from "@/app/(pages)/(components)/menu";
import { urlForImage, getSeoData } from "@/libs/sanity";

import "../styles/index.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WindowEventsProvider>
          <StoreProvider>
            <GSAP />
            <Preloader />
            <Menu />
            <Navigation />
            <ScrollWrapper>
              <Transition>{children}</Transition>
            </ScrollWrapper>
            <ReactTempus patch />
            <Grid />
            <Stats />
          </StoreProvider>
        </WindowEventsProvider>
      </body>
    </html>
  );
}

export async function generateMetadata() {
  const data = await getSeoData();
  const seo = data?.fallbackSEO;

  const title = seo?.metaTitle || "Next Starter";
  const description = seo?.metaDescription || "Next Starter";
  const ogImage = seo?.ogImage
    ? urlForImage(seo.ogImage).width(1200).height(630).url()
    : null;

  const image = ogImage
    ? {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: seo?.ogImage?.alt || title,
      }
    : {};

  return {
    // metadataBase: new URL(""),
    title,
    description,
    keywords: seo?.keywords || "",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://preymaker.com",
      siteName: "Preymaker",
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons: {
      icon: [
        {
          url: "/icons/favicon.ico",
          type: "image/ico",
          sizes: "256x256",
        },
      ],
      apple: [{ url: "/icons/favicon.ico", sizes: "256x256" }],
    },
    authors: [{ name: "Mathis Humbert", url: "https://mathishumbert.com/" }],
  };
}
