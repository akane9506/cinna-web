import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/components/pixi.ts";
import App from "@/App.tsx";
import "@/index.css";

async function loadFonts() {
  await Promise.all([
    document.fonts.load("18px Geist Pixel"),
    document.fonts.load("130px Roboto Slab"),
  ]);
}

loadFonts();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
