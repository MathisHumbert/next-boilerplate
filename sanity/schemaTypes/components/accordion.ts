import { Rule } from "sanity";

export default {
  name: "accordion",
  title: "Accordion",
  type: "object",
  fields: [
    {
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "accordion-item",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: "content",
              title: "Content",
              type: "text",
              rows: 3,
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "content",
            },
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      items: "items",
    },
    prepare({ items }: { items?: Array<{ label?: string }> }) {
      return {
        title: "Accordion",
        subtitle: items
          ? `${items.length} item${items.length !== 1 ? "s" : ""}`
          : "No items",
      };
    },
  },
};
