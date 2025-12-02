import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";
import { singletonTools } from "sanity-plugin-singleton-tools";

import { structure } from "./structure";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Starter",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [singletonTools(), structureTool({ structure }), media()],

  schema: {
    types: schemaTypes as any,
  },
});
