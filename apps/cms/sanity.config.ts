import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
// Create your own Sanity project, then set these in .env (see ../../.env.example)
export default defineConfig({ name: "student-affairs", title: "Student Affairs CMS",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id", dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool()], schema: { types: schemaTypes } });
