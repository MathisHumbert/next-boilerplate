import { Rule } from "sanity";

export default {
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    {
      name: "subtitle",
      title: "Subtitle",
      description: "Small subtitle text above the main heading",
      type: "text",
      rows: 2,
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "titleLeft",
      title: "Title Left",
      description: "First line of the main heading",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "titleRight",
      title: "Title Right",
      description: "Second line of the main heading",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      titleLeft: "titleLeft",
      titleRight: "titleRight",
      subtitle: "subtitle",
    },
    prepare({
      titleLeft,
      titleRight,
      subtitle,
    }: {
      titleLeft?: string;
      titleRight?: string;
      subtitle?: string;
    }) {
      return {
        title: "Hero",
        subtitle: `${subtitle || "No subtitle"} | ${titleLeft || ""} ${titleRight || ""}`,
      };
    },
  },
};
