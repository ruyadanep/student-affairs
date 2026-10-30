import { defineType, defineField } from "sanity";
export const notice = defineType({ name: "notice", title: "Public notice or news", type: "document", fields: [
  defineField({ name: "title", type: "string", validation: (r) => r.required() }),
  defineField({ name: "slug", type: "slug", options: { source: "title" } }),
  defineField({ name: "date", type: "date" }),
  defineField({ name: "summary", type: "text", rows: 3 }),
  defineField({
  name: "image",
  title: "News image",
  type: "image",
  options: { hotspot: true },
}),
  defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
  defineField({ name: "published", type: "boolean", initialValue: false }),
] });
