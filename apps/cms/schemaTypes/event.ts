
import { defineType, defineField } from "sanity";

export const event = defineType({
  name: "event",
  title: "Events",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(120),
    }),

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "date",
      title: "Event Date and Time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "endDate",
      title: "Event End Date and Time",
      type: "datetime",
      description: "Optional. Enter this if the event has an end date or time.",
    }),

    defineField({
      name: "category",
      title: "Event Category",
      type: "string",
      options: {
        list: [
          { title: "Academic", value: "academic" },
          { title: "Student Welfare", value: "welfare" },
          { title: "Orientation", value: "orientation" },
          { title: "Sports and Recreation", value: "sports" },
          { title: "Career Development", value: "career" },
          { title: "Social and Cultural", value: "social" },
          { title: "General", value: "general" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Event Description",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required().min(20),
    }),

    defineField({
      name: "image",
      title: "Event Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "location",
      title: "Event Venue",
      type: "string",
    }),

    defineField({
      name: "featured",
      title: "Feature on Homepage",
      type: "boolean",
      initialValue: false,
      description: "Enable this to highlight the event on the homepage.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      date: "date",
      category: "category",
      media: "image",
    },
    prepare({ title, date, category, media }) {
      return {
        title,
        subtitle: [
          date ? new Date(date).toLocaleString() : "Date not set",
          category,
        ]
          .filter(Boolean)
          .join(" • "),
        media,
      };
    },
  },

  orderings: [
    {
      title: "Event Date (Upcoming First)",
      name: "eventDateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
});
