import { render } from "https://deno.land/x/resvg_wasm@0.1.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.32-alpha/deno-dom-wasm.ts";
import * as css from "https://deno.land/x/css@0.3.0/mod.ts";

const css_ = `
pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{color:#abb2bf;background:#282c34}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}
#code {
  white-space: pre-wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14pt;
  padding: 5px;
}.line-number {
  text-align: right;
  vertical-align: top;
  color: #abb2bf80;
  padding-right: 10px;
  border-right: 1px dashed #abb2bf40;
}.code-line {
  padding-left: 10px;
  font-family: 'JetBrains Mono', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  color: #abb2bf;
  background: #282c34;
}`;

const html = `<html lang="en"><head>
<link href="https://fonts.googleapis.com/css2?family=JetBrains%20Mono&display=swap" rel="stylesheet">
<style>${css_}</style></head>
<body style="display: inline-block;"><pre  style="width: max-content;"><code class="hljs js" id="code"><table><tbody id="blah"><tr><td class="line-number">1</td><td class="code-line"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;&quot;</span>);</td></tr>
<tr><td class="line-number">2</td><td class="code-line"><span class="hljs-title function_">render</span>();</td></tr>
<tr><td class="line-number">3</td><td class="code-line"><span class="hljs-keyword">const</span> k = <span class="hljs-string">&quot;foo&quot;</span>;</td></tr></tbody></table></code></pre></body></html>`;

const doc = new DOMParser().parseFromString(html, "text/html")!;
const lines = doc.getElementsByClassName("code-line");

const colors: Record<string, string> = {};
const cssAST = css.parse(css_);

for (let i = 0; i < cssAST.stylesheet.rules.length; i++) {
  const rule = cssAST.stylesheet.rules[i];
  const decl = rule.declarations.find((x) => x.value && x.name === "color");
  if (!decl) continue;

  for (const selector of rule.selectors) {
    colors[selector.slice(1)] = decl.value!;
  }
}

let svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect fill="#303030" x="0" y="0" width="512" height="256"></rect>`;

for (let l = 0; l < lines.length; l++) {
  const line = lines[l];

  const colored = new Array<string>();

  for (let i = 0; i < line.children.length; i++) {
    const node = line.children[i];
    colored.push(colors[node.classList[0]]);
  }

  const entities = new Array<{ color: string; text: string }>();

  let x = 0;
  for (let i = 0; i < line.childNodes.length; i++) {
    const node = line.childNodes[i];
    const string = node.childNodes?.[0]?.textContent ?? node.textContent;
    if (node.hasChildNodes()) {
      entities.push({ text: string, color: colored[x] });
      x++;
    } else {
      entities.push({ text: string, color: "#abb2bf" });
    }
  }

  // svgString +=
  //   `<text font-family="monospace" font-size="16px" xml:space="preserve" font-weight="normal">`;
  // for (let i = 0; i < entities.length; i++) {
  //   const e = entities[i];
  //   svgString += `<tspan x="${ax}px" y="${
  //     (l + 1) * 20
  //   }px" fill="${e.color}">${e.text}</tspan>`;
  //   ax += 16 * e.text.length;
  // }

  // svgString += `</text>`;
  let ax = 10;
  svgString += entities.map((e, i) => {
    // console.log(entities[i-1].text.length)
    const url =
      `<text font-family="monospace" font-weight="normal" font-size="16" x="${ax}" y="${
        (l + 1) * 20
      }" fill="${e.color}">${e.text}</text>`;
    ax = (entities[i - 1]?.text?.length) * 16 ?? 10;
    return url;
  }).join("");
}

// svgString += `<tspan font-size="16px" dx="-16px" fill="${e.color}" \
//   x="${ax}px" y="${(l + 1) * 20}px">${e.text}</tspan>`;
// ax += 16 * e.text.length;
// console.log(ax);

svgString += `\n</svg>`;

Deno.writeFileSync("out.png", render(svgString));
