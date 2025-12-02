export default {
  name: "page-settings",
  title: "Page Settings",
  type: "object",
  fields: [
    {
      name: "theme",
      title: "Theme",
      type: "string",
      description: "Choose the color theme for this page",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
      initialValue: "light",
    },
    {
      name: "showFooter",
      title: "Show Footer",
      type: "boolean",
      description: "Display the footer on this page",
      initialValue: true,
    },
    {
      name: "footerPage",
      title: "Footer Link Page",
      type: "reference",
      description: "Page to link from the footer (only if footer is shown)",
      to: [{ type: "home" }, { type: "about" }],
      hidden: ({ parent }: { parent?: { showFooter?: boolean } }) =>
        !parent?.showFooter,
      options: {
        disableNew: true,
      },
    },
  ],
};
