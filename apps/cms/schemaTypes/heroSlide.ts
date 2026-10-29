import { defineType, defineField } from "sanity";
export const heroSlide = defineType({ name: "heroSlide", title: "Homepage slide", type: "document", fields: [
  defineField({ name: "headline", type: "string", validation: (r) => r.required() }),
  defineField({ name: "subheadline", type: "string" }),
  defineField({ name: "image", type: "image", options: { hotspot: true } }),
  defineField({ name: "ctaLabel", type: "string" }), defineField({ name: "ctaUrl", type: "string" }),
  defineField({ name: "order", type: "number" }), defineField({ name: "published", type: "boolean", initialValue: false }),
] });
