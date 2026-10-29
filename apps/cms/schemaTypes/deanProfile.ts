import { defineType, defineField } from "sanity";
export const deanProfile = defineType({ name: "deanProfile", title: "Dean's profile", type: "document", fields: [
  defineField({ name: "name", type: "string", validation: (r) => r.required() }),
  defineField({ name: "title", type: "string", initialValue: "Dean of Student Affairs" }),
  defineField({ name: "photo", type: "image", options: { hotspot: true } }),
  defineField({ name: "message", title: "Message to students", type: "text", rows: 8 }),
] });
