"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import FontFaceObserver from "fontfaceobserver";
import imagesLoadedLib from "imagesloaded";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { delay } from "@/libs/utils";
import { $areFontsLoaded, $isPageVisible, $isAppMounted } from "@/store/global";

const showPreloader = process.env.NODE_ENV === "development";
// const showPreloader = true;

export function Preloader() {
  if (!showPreloader) {
    return <PreloaderDevelopment />;
  } else {
    return <PreloaderProduction />;
  }
}

function PreloaderDevelopment() {
  useEffect(() => {
    document.documentElement.classList.add("loaded", "visible");
    window.dispatchEvent(new Event("resize"));

    $areFontsLoaded.set(true);
    $isPageVisible.set(true);
    $isAppMounted.set(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function PreloaderProduction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(true);
  const path = usePathname();

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(containerRef.current, { opacity: 1 });
    },
    { scope: containerRef },
  );

  const loadFonts = async () => {
    try {
      const newGroteskFont = new FontFaceObserver("Satoshi");

      await Promise.all([newGroteskFont.load()]);

      setFontsLoaded(true);
      $areFontsLoaded.set(true);
    } catch (error: any) {
      console.log(error);
      setFontsLoaded(true);
      $areFontsLoaded.set(true);
    }
  };

  const loadImages = () => {
    const images = document.querySelectorAll('img[loading="eager"]');
    const total = images.length;

    if (total === 0) {
      setImagesLoaded(true);
      return;
    }

    const imgLoad = imagesLoadedLib(document.body);

    imgLoad.on("done", () => {
      setImagesLoaded(true);
    });

    imgLoad.on("fail", () => {
      setImagesLoaded(true);
    });
  };

  const hidePreloader = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        enablePage();
        setShouldRender(false);
      },
    });

    tl.set(document.body, { opacity: 1 });
  });

  const enablePage = async () => {
    document.documentElement.classList.add("loaded", "visible");
    window.dispatchEvent(new Event("resize"));

    await delay(0.1);

    $isPageVisible.set(true);
    $isAppMounted.set(true);
  };

  useEffect(() => {
    loadFonts();
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imagesLoaded && fontsLoaded) {
      hidePreloader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded, imagesLoaded]);

  if (!shouldRender) return null;

  return <div className="preloader" ref={containerRef}></div>;
}
