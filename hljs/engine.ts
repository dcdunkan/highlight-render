import { initialize, svg2png } from "https://esm.sh/svg2png-wasm@1.3.4";
import { resolve } from "https://deno.land/std@0.150.0/path/mod.ts";
import { getColors2, makeSVG2 } from "./helpers.ts";

const FONT_DIR = resolve("assets/fonts");

await initialize(Deno.readFile("assets/svg2png_wasm_bg.wasm"));

const fonts: Uint8Array[] = [];
for (const { name } of Deno.readDirSync(FONT_DIR)) {
  fonts.push(Deno.readFileSync(`${FONT_DIR}/${name}`));
}
console.log(`Loaded ${fonts.length} fonts.`);

const html = Deno.readTextFileSync("hljs/indexy.html");
const cssString = Deno.readTextFileSync("hljs/proper.css");

console.time("Render");
const svg = await render(html, { css: cssString });
console.timeEnd("Render");

Deno.writeFileSync("new.png", svg);

export function render(
  htmlString: string,
  config: {
    css: string;
    font?: string;
    fontPath?: string;
    fontSize?: number;
    backgroundColor?: string;
    scale?: number;
  },
) {
  const props = getColors2(config.css);
  const svg = makeSVG2(htmlString, props, config.fontSize ?? 12);
  return svg2png(svg, {
    backgroundColor: config.backgroundColor ?? props.get(".hljs")!.background,
    defaultFontFamily: {
      monospaceFamily: config.font ?? "JetBrains Mono NL",
    },
    fonts: fonts,
    scale: config.scale ?? 2,
  });
}
