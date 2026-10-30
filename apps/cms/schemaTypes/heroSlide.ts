
import { defineType, defineField } from "sanity";

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Homepage Hero Slides",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Slide Name",
      type: "string",
      description: "Internal name to identify this slide in the CMS.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "headline",
      title: "Main Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "subheadline",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(250),
    }),

    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "imageAlt",
      title: "Image Alternative Text",
      type: "string",
      description: "Describe the image for accessibility.",
    }),

    defineField({
      name: "ctaLabel",
      title: "Button Text",
      type: "string",
    }),

    defineField({
      name: "ctaUrl",
      title: "Button Link",
      type: "string",
    }),

    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),

    defineField({
      name: "published",
      title: "Publish Slide",
      type: "boolean",
      initialValue: false,
      description: "Only published slides appear on the homepage.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      headline: "headline",
      media: "image",
      published: "published",
      order: "order",
    },
    prepare({ title, headline, media, published, order }) {
      return {
        title: title || headline || "Untitled slide",
        subtitle: `Slide ${order ?? "-"} • ${
          published ? "Published" : "Draft"
        }`,
        media,
      };
    },
  },

  orderings: [
    {
      title: "Display Order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
