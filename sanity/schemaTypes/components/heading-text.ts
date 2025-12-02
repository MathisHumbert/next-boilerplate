import { Rule } from "sanity";

export default {
  name: "heading-text",
  title: "Heading & Text",
  type: "object",
  fields: [
    {
      name: "heading",
      title: "Heading",
      description: "Main heading text displayed prominently",
      type: "text",
      rows: 2,
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      description: "Subtitle text displayed below the main heading",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "text",
      title: "Text",
      description: "Descriptive text displayed below the subtitle",
      type: "text",
      rows: 3,
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      heading: "heading",
      subtitle: "subtitle",
      text: "text",
    },
    prepare({ heading }: { heading?: string }) {
      return {
        title: "Heading & Text",
        subtitle: heading,
      };
    },
  },
};
