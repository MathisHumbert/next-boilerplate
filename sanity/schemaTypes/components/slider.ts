import { Rule } from "sanity";

export default {
  name: "slider",
  title: "Slider",
  type: "object",
  fields: [
    {
      name: "images",
      title: "Images",
      description: "List of images to display in the slider",
      type: "array",
      of: [
        {
          type: "custom-image",
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      images: "images",
    },
    prepare({ images }: { images?: any[] }) {
      const imageCount = images?.length || 0;
      return {
        title: "Slider",
        subtitle: `${imageCount} image${imageCount !== 1 ? "s" : ""}`,
        media: images?.[0],
      };
    },
  },
};
