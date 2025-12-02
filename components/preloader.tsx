"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import FontFaceObserver from "fontfaceobserver";
import imagesLoadedLib from "imagesloaded";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { delay, events } from "@/libs/utils";
import { useStore } from "@/libs/store";

export function Preloader() {
  if (process.env.NODE_ENV === "development") {
    return <PreloaderDevelopment />;
  } else {
    return <PreloaderProduction />;
  }
}

function PreloaderDevelopment() {
  const path = usePathname();
  const { setAreFontsLoaded, setPageVisible } = useStore();

  useEffect(() => {
    document.documentElement.classList.add("loaded", "visible");
    window.dispatchEvent(new Event("resize"));
    setAreFontsLoaded(true);
    setPageVisible(true);
    events.emit("showPage", path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function PreloaderProduction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const path = usePathname();
  const { setAreFontsLoaded } = useStore();

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(containerRef.current, { opacity: 1 });
    },
    { scope: containerRef }
  );

  const loadFonts = async () => {
    try {
      const newGroteskFont = new FontFaceObserver("Satoshi");

      await Promise.all([newGroteskFont.load()]);

      setFontsLoaded(true);
      setAreFontsLoaded(true);
    } catch (error: any) {
      console.log(error);
      setFontsLoaded(true);
      setAreFontsLoaded(true);
    }
  };

  const loadImages = () => {
    const images = document.querySelectorAll("img");
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

        if (containerRef.current && containerRef.current.parentNode) {
          containerRef.current.parentNode.removeChild(containerRef.current);
        }
      },
    });

    tl.set(document.body, { opacity: 1 });
  });

  const enablePage = async () => {
    document.documentElement.classList.add("loaded", "visible");
    window.dispatchEvent(new Event("resize"));

    await delay(0.1);

    events.emit("showPage", path);
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

  return <div className="preloader" ref={containerRef}></div>;
}
