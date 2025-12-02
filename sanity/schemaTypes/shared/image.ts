import { Rule } from "sanity";

export default {
  name: "custom-image",
  title: "Image",
  type: "object",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "alt",
      title: "Alt Text",
      type: "string",
      description:
        "Alternative text for accessibility (shared across all device sizes)",
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
};
