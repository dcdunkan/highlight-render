import { svg } from "./parseSVG.ts";
import { initialize, svg2png } from "https://esm.sh/svg2png-wasm@1.3.4";

// Load and initialize Rendering WASM Module
await initialize(Deno.readFile("assets/svg2png_wasm_bg.wasm"));

const SCALE = 5;
const FONT = "JetBrains Mono"; // "MesloLGS NF";

const imageBuff = await svg2png(svg.svg, {
  scale: SCALE,
  backgroundColor: svg.background,
  fonts: [
    Deno.readFileSync("assets/fonts/JetBrainsMono-Regular.ttf"),
    Deno.readFileSync("assets/fonts/MesloLGS NF Regular.ttf"),
  ],
  defaultFontFamily: {
    monospaceFamily: FONT,
  },
});

Deno.writeFileSync(`out-${SCALE}x-${FONT.replace(/\s/g, "_")}.png`, imageBuff);
