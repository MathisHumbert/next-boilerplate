// singleton
import home from "./singleton/home";
import about from "./singleton/about";
import settings from "./singleton/settings";

// repeatables

// components
import headingText from "./components/heading-text";
import hero from "./components/hero";
import slider from "./components/slider";

// shared
import seo from "./shared/seo";
import pageSettings from "./shared/page-settings";
import image from "./shared/image";

export const schemaTypes = [
  // singleton
  home,
  about,
  settings,

  // repeatables

  // components
  headingText,
  hero,
  slider,

  // shared
  seo,
  pageSettings,
  image,
];
