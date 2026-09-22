import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const stubPlugin = () => {
  return {
    name: "stub-unused-sibling-documents",
    enforce: "pre" as const,
    resolveId(id: string) {
      if (
        id.includes("tidecrestDocument") ||
        id.includes("meridianDocument") ||
        id.includes("asciiFieldDocuments") ||
        id.includes("betawiseGlobeDocument") ||
        id.includes("axonis-") ||
        id.includes("NocturneScene") ||
        id.includes("sandboxedPageDocument") ||
        id.includes("SylvaLivingWorldScene") ||
        id.includes("inner-green-3d")
      ) {
        return "virtual:threeui-stub-" + id.replace(/[^a-zA-Z0-9]/g, "_");
      }
      return null;
    },
    load(id: string) {
      if (id.startsWith("virtual:threeui-stub-")) {
        return `
          export default "";
          export const buildTidecrestDocument = () => "";
          export const buildMeridianDocument = () => "";
          export const buildAsciiFieldDocument = () => "";
          export const buildBetawiseGlobeDocument = () => "";
          export const buildSandboxedPageDocument = () => "";
          export const NOCTURNE_TITLES = {};
          export const NOCTURNE_VARIANTS = [];
          export const buildNocturneDocument = () => "";
          export const MAPLE_AUTUMN_STYLE = "";
          export const SAKURA_SUNSET_STYLE = "";
          export const SEQUOIA_MIST_STYLE = "";
          export const applyMapleAutumnVariant = () => "";
          export const applySakuraSunsetVariant = () => "";
          export const applySequoiaMistVariant = () => "";
        `;
      }
      return null;
    },
  };
};

export default defineConfig({
  plugins: [stubPlugin(), react()],
  resolve: {
    alias: {
      "@designcodeio/threeui/style.css": path.resolve(__dirname, "src/shaders/threeui.css"),
      "@designcodeio/threeui": path.resolve(__dirname, "src/shaders/landing-pages/LandingPages.tsx"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
