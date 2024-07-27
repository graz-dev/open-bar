import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import openbar from "./src/data/openbar.json"

// https://astro.build/config
export default defineConfig({
  site: openbar.general.url,
  integrations: [tailwind(), mdx(), sitemap(), icon()],
});
