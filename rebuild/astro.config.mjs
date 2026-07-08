import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  integrations: [alpinejs()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  devToolbar: {
    enabled: false,
  },
});
