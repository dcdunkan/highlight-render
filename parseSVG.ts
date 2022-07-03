import {
  DOMParser,
  HTMLElement,
  HTMLTableCellElement,
} from "https://esm.sh/linkedom@0.14.12";
import * as css from "https://deno.land/x/css@0.3.0/mod.ts";

const FONT_SIZE = 12;
/** VISUAL_LENGTH */
const VL = 7;
/** LINE SPACING */
const LS = 20;
const MARGIN = 15;
/** Visual spacing of `CHARS` */
const DOT_VS = 2;
// deno-fmt-ignore
const SMALL_CHARS = [".", "(", ")", "{", "}", "[", "]", ",", ":", ";", "/", "'", "\"", "_", "-"];

const parse = new DOMParser().parseFromString;

const cssString =
  `pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#1e1e1e;color:#dcdcdc}.hljs-keyword,.hljs-literal,.hljs-name,.hljs-symbol{color:#569cd6}.hljs-link{color:#569cd6;text-decoration:underline}.hljs-built_in,.hljs-type{color:#4ec9b0}.hljs-class,.hljs-number{color:#b8d7a3}.hljs-meta .hljs-string,.hljs-string{color:#d69d85}.hljs-regexp,.hljs-template-tag{color:#9a5334}.hljs-formula,.hljs-function,.hljs-params,.hljs-subst,.hljs-title{color:#dcdcdc}.hljs-comment,.hljs-quote{color:#57a64a;font-style:italic}.hljs-doctag{color:#608b4e}.hljs-meta,.hljs-meta .hljs-keyword,.hljs-tag{color:#9b9b9b}.hljs-template-variable,.hljs-variable{color:#bd63c5}.hljs-attr,.hljs-attribute{color:#9cdcfe}.hljs-section{color:gold}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-bullet,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-selector-pseudo,.hljs-selector-tag{color:#d7ba7d}.hljs-addition{background-color:#144212;display:inline-block;width:100%}.hljs-deletion{background-color:#600;display:inline-block;width:100%}
#code {
  white-space: pre-wrap;
  font-family: 'Anonymous Pro', monospace;
  font-size: 14pt;
  padding: 5px;
}.line-number {
  text-align: right;
  vertical-align: top;
  color: #dcdcdc80;
  padding-right: 10px;
  border-right: 1px dashed #dcdcdc40;
}.code-line {
  padding-left: 10px;
  font-family: 'Anonymous Pro', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  color: #dcdcdc;
  background: #1e1e1e;
}
::-webkit-scrollbar {
  display: none;
}`;

const html = `
<html lang="en"><head>
<link href="https://fonts.googleapis.com/css2?family=Anonymous%20Pro&display=swap" rel="stylesheet">
<style>pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#1e1e1e;color:#dcdcdc}.hljs-keyword,.hljs-literal,.hljs-name,.hljs-symbol{color:#569cd6}.hljs-link{color:#569cd6;text-decoration:underline}.hljs-built_in,.hljs-type{color:#4ec9b0}.hljs-class,.hljs-number{color:#b8d7a3}.hljs-meta .hljs-string,.hljs-string{color:#d69d85}.hljs-regexp,.hljs-template-tag{color:#9a5334}.hljs-formula,.hljs-function,.hljs-params,.hljs-subst,.hljs-title{color:#dcdcdc}.hljs-comment,.hljs-quote{color:#57a64a;font-style:italic}.hljs-doctag{color:#608b4e}.hljs-meta,.hljs-meta .hljs-keyword,.hljs-tag{color:#9b9b9b}.hljs-template-variable,.hljs-variable{color:#bd63c5}.hljs-attr,.hljs-attribute{color:#9cdcfe}.hljs-section{color:gold}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-bullet,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-selector-pseudo,.hljs-selector-tag{color:#d7ba7d}.hljs-addition{background-color:#144212;display:inline-block;width:100%}.hljs-deletion{background-color:#600;display:inline-block;width:100%}
#code {
  white-space: pre-wrap;
  font-family: 'Anonymous Pro', monospace;
  font-size: 14pt;
  padding: 5px;
}.line-number {
  text-align: right;
  vertical-align: top;
  color: #dcdcdc80;
  padding-right: 10px;
  border-right: 1px dashed #dcdcdc40;
}.code-line {
  padding-left: 10px;
  font-family: 'Anonymous Pro', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  color: #dcdcdc;
  background: #1e1e1e;
}
::-webkit-scrollbar {
  display: none;
}
</style></head>
<body style="display: inline-block;"><pre  style="max-width: 1400px;"><code class="hljs " id="code"><table><tbody><tr><td class="line-number">1</td><td class="code-line"><span class="hljs-keyword">import</span> { svg2png, initialize } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;svg2png-wasm&#x27;</span>;</td></tr>
<tr><td class="line-number">2</td><td class="code-line"><span class="hljs-comment">// const { svg2png, initialize } = require(&#x27;svg2png-wasm&#x27;);</span></td></tr>
<tr><td class="line-number">3</td><td class="code-line"><span class="hljs-keyword">import</span> { readFileSync, writeFileSync } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;fs&#x27;</span>;</td></tr>
<tr><td class="line-number">4</td><td class="code-line"></td></tr>
<tr><td class="line-number">5</td><td class="code-line"><span class="hljs-keyword">await</span> <span class="hljs-title function_">initialize</span>(</td></tr>
<tr><td class="line-number">6</td><td class="code-line">  <span class="hljs-title function_">readFileSync</span>(<span class="hljs-string">&#x27;./node_modules/svg2png-wasm/svg2png_wasm_bg.wasm&#x27;</span>),</td></tr>
<tr><td class="line-number">7</td><td class="code-line">);</td></tr>
<tr><td class="line-number">8</td><td class="code-line"></td></tr>
<tr><td class="line-number">9</td><td class="code-line"><span class="hljs-comment">/** <span class="hljs-doctag">@type</span> {<span class="hljs-type">Uint8Array</span>} */</span></td></tr>
<tr><td class="line-number">10</td><td class="code-line"><span class="hljs-keyword">const</span> png = <span class="hljs-keyword">await</span> <span class="hljs-title function_">svg2png</span>(</td></tr>
<tr><td class="line-number">11</td><td class="code-line">  <span class="hljs-string">&#x27;&lt;svg viewBox=&quot;0 0 200 200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;&gt; ... &lt;/svg&gt;&#x27;</span>,</td></tr>
<tr><td class="line-number">12</td><td class="code-line">  {</td></tr>
<tr><td class="line-number">13</td><td class="code-line">    <span class="hljs-attr">scale</span>: <span class="hljs-number">2</span>, <span class="hljs-comment">// optional</span></td></tr>
<tr><td class="line-number">14</td><td class="code-line">    <span class="hljs-attr">width</span>: <span class="hljs-number">400</span>, <span class="hljs-comment">// optional</span></td></tr>
<tr><td class="line-number">15</td><td class="code-line">    <span class="hljs-attr">height</span>: <span class="hljs-number">400</span>, <span class="hljs-comment">// optional</span></td></tr>
<tr><td class="line-number">16</td><td class="code-line">    <span class="hljs-attr">backgroundColor</span>: <span class="hljs-string">&#x27;white&#x27;</span>, <span class="hljs-comment">// optional</span></td></tr>
<tr><td class="line-number">17</td><td class="code-line">    <span class="hljs-attr">fonts</span>: [</td></tr>
<tr><td class="line-number">18</td><td class="code-line">      <span class="hljs-comment">// optional</span></td></tr>
<tr><td class="line-number">19</td><td class="code-line">      <span class="hljs-title function_">readFileSync</span>(<span class="hljs-string">&#x27;./Roboto.ttf&#x27;</span>), <span class="hljs-comment">// require, If you use text in svg</span></td></tr>
<tr><td class="line-number">20</td><td class="code-line">    ],</td></tr>
<tr><td class="line-number">21</td><td class="code-line">    <span class="hljs-attr">defaultFontFamily</span>: {</td></tr>
<tr><td class="line-number">22</td><td class="code-line">      <span class="hljs-comment">// optional</span></td></tr>
<tr><td class="line-number">23</td><td class="code-line">      <span class="hljs-attr">sansSerif</span>: <span class="hljs-string">&#x27;Roboto&#x27;</span>,</td></tr>
<tr><td class="line-number">24</td><td class="code-line">    },</td></tr>
<tr><td class="line-number">25</td><td class="code-line">  },</td></tr>
<tr><td class="line-number">26</td><td class="code-line">);</td></tr>
<tr><td class="line-number">27</td><td class="code-line"><span class="hljs-title function_">writeFileSync</span>(<span class="hljs-string">&#x27;./output.png&#x27;</span>, png);</td></tr></tbody></table></code></pre></body></html>`;

export const svg = parseToSvg(html, cssString);

export function parseToSvg(html: string, cssString: string) {
  const doc = parse(html, "text/html");

  let background = "";
  let normalColor = "";

  const colors = new Map<string, string>();
  const cssAST = css.parse(cssString);

  for (let i = 0; i < cssAST.stylesheet.rules.length; i++) {
    const rule = cssAST.stylesheet.rules[i];

    if (rule.selectors.includes(".hljs")) {
      rule.declarations.map(({ name, value }) => {
        if (value?.length === 4) value += value.substring(1);
        if (name === "color") normalColor = value!;
        if (name === "background") background = value!;
      });
    }

    const decl = rule.declarations.find((d) => d.value && d.name === "color");
    if (!decl || !decl.value) continue;
    for (const selector of rule.selectors) {
      colors.set(selector.slice(1), decl.value);
    }
  }

  const lines = doc.getElementsByClassName(
    "code-line",
  ) as HTMLTableCellElement[];

  let svg = "";
  let highestLineLength = 0;

  for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];

    const children = line.childNodes as HTMLElement[];
    let x_pos = MARGIN;

    for (let ci = 0; ci < children.length; ci++) {
      const child = children[ci];
      const classList = child.classList as Set<string> | undefined;
      const color = child.hasChildNodes() && classList
        ? colors.get(classList.values().next()?.value)!
        : normalColor;
      const text = child.textContent as string;

      if (color === normalColor) {
        console.log(text.at(0), ln + 1);
      }
      if (SMALL_CHARS.includes(text.trim()[0]) && color === normalColor) {
        x_pos += DOT_VS;
      }

      svg += `<text 
x="${x_pos}" y="${(ln + 1) * LS}" xml:space="preserve"
font-family="monospace" font-size="${FONT_SIZE}"
fill="${color}">${text}</text>`;

      x_pos += text.length * VL;

      if (x_pos > highestLineLength) {
        highestLineLength = x_pos;
      }

      // console.log({ text, x_pos, y: (ln + 1) * LS });
    }
  }

  // console.log(
  //   `x="${(highestLineLength + MARGIN - VL)}" y="${(lines.length + 1) * (LS - 2)}"`,
  // );

  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg">${svg}
<text font-family="serif" fill="${background}"
x="${highestLineLength + MARGIN - VL}"
y="${(lines.length + 1) * (LS - 2)}">X</text></svg>`,
    background,
  };
}
