import {
  DocumentIcon,
  TiersIcon,
  EarthGlobeIcon,
  CogIcon,
} from "@sanity/icons";

export default {
  name: "home",
  title: "Home",
  type: "document",
  icon: DocumentIcon,
  options: {
    singleton: true,
  },
  groups: [
    {
      name: "content",
      title: "Content",
      icon: TiersIcon,
    },
    {
      name: "seo",
      title: "SEO",
      icon: EarthGlobeIcon,
    },
    {
      name: "settings",
      title: "Settings",
      icon: CogIcon,
    },
  ],
  fields: [
    {
      name: "content",
      title: "Content",
      type: "array",
      group: "content",
      // options: {
      //   insertMenu: {
      //     views: [
      //       {
      //         name: 'grid',
      //         previewImageUrl: (schemaTypeName) => `/static/components/${schemaTypeName}.webp`,
      //       },
      //     ],
      //   },
      // },
      of: [
        {
          type: "hero",
        },
        {
          type: "heading-text",
        },
        {
          type: "slider",
        },
      ],
    },
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    },
    {
      name: "settings",
      title: "Settings",
      type: "page-settings",
      group: "settings",
    },
  ],
  preview: {
    select: {
      title: "title",
    },
  },
};
