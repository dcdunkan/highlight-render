import {
  DOMParser,
  HTMLElement,
  HTMLTableCellElement,
} from "https://esm.sh/linkedom@0.14.12";
import { parse } from "https://deno.land/x/css@0.3.0/mod.ts";

const parseHTML = new DOMParser().parseFromString;

interface Token {
  text: string;
  color: string;
}

interface FontSizeProperties {
  font_size: number;
  char_space: number; // length * char_space
  line_height: number; // technically not line_height.
  margin: {
    // we don't need bottom, because it is the same as the line_height.
    top: number;
    right: number;
    left: number;
  };
}

// Experiment and add yourself a few if you'd like to.
// I don't want to spend time on this since I'm fine with 12.
export const FONT_SIZE_PROPS: Record<
  number,
  FontSizeProperties
> = {
  12: { // the official one
    font_size: 12, // future use.
    line_height: 20,
    char_space: 7.2,
    margin: {
      top: 25,
      right: 8,
      left: 15,
    },
  },
};

const htmlString = Deno.readTextFileSync("hljs/test.html");
const cssString = Deno.readTextFileSync("hljs/gh-dark.css");
getLineTokens(htmlString, getColors(cssString));

export function getColors(cssString: string) {
  const colors = new Map<string, string>();
  const parsed = parse(cssString);

  // Get theme background color and normal text color.
  const rule = parsed.stylesheet.rules.find((rule) =>
    rule.selectors.includes(".hljs")
  )!; // there has to be one if you're using hljs.
  for (let { name, value } of rule.declarations) {
    if (!value) continue;
    if (value.length === 4) value += value.substring(1);
    switch (name) {
      case "color":
        colors.set("normal", value);
        break;
      case "background":
        colors.set("background", value);
    }
  }

  // Go through and find 'color' properties.
  for (const rule of parsed.stylesheet.rules) {
    // console.log(rule.selectors);
    const color = rule.declarations.find((declaration) =>
      declaration.value && declaration.name === "color"
    );
    if (!color || !color.value) continue;

    for (const selectors of rule.selectors) {
      // for (const selector of selectors.split(" ")) {
      colors.set(selectors.slice(1), color.value);
      // }
    }
  }

  // console.log(colors);
  return colors;
}

export function getLineTokens(htmlString: string, colors: Map<string, string>) {
  const normalColor = colors.get("normal")!; // there is.

  const doc = parseHTML(htmlString, "text/html");
  const lineEls = doc.getElementsByClassName(
    "code-line",
  ) as HTMLTableCellElement[];

  const lines: Token[][] = [];

  for (const line of lineEls) {
    const children = line.childNodes as HTMLElement[];
    const lineTokens: Token[] = [];
    for (const child of children) {
      const classes = child.classList as Set<string> | undefined;
      if (classes && Array.from(classes.values()).includes("function_")) {
        // console.log(child.textContent);
      }
      const color = child.hasChildNodes() && classes // checks if its a hljs el.
        ? colors.get(classes.values().next()?.value)! // there has to be.
        : normalColor;
      const text = child.textContent as string;
      lineTokens.push({ text, color });
    }
    lines.push(lineTokens);
  }

  return lines;
}

export function makeSVG(
  htmlString: string,
  colors: Map<string, string>,
  fontSize: number,
) {
  const props = FONT_SIZE_PROPS[fontSize];
  if (!props) {
    throw new Error(
      `Unsupported font size: ${fontSize}. No font properties found.`,
    );
  }

  const lines = getLineTokens(htmlString, colors);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg">\n`;

  let longestLineLength = props.margin.left;

  let y = props.margin.top; // 25;
  for (const line of lines) {
    let x = props.margin.left; // 15;
    for (const token of line) {
      svg += `
      <text xml:space="preserve"
            x="${x}"
            y="${y}"
            font-size="${fontSize}"
            font-family="monospace"
            text-rendering="geometricPrecision"
            fill="${token.color}"
      >${escape(token.text)}</text>`;

      x += token.text.length * props.char_space; // 7.2;
    }

    y += props.line_height; // 20;

    if (x > longestLineLength) {
      longestLineLength = x;
    }
  }

  // The bottom and right empty spacing.
  svg += `
  <text xml:space="preserve"
        x="${longestLineLength + props.margin.right}"
        y="${y}"
        font-size="${fontSize}"
        font-family="monospace"
        text-rendering="geometricPrecision"
        fill="${colors.get("background")}"
  >.</text>`;

  svg += `\n</svg>`;
  return svg;
}

function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const supported_attrs = [
  "color",
  "font-style",
  "font-weight",
  "background",
  "text-decoration",
  "background-color",
] as const;

type DeclarationName = typeof supported_attrs[number];
type Declaration = {
  [K in DeclarationName]?: string;
};

export function getColors2(cssString: string) {
  const colors = new Map<string, Declaration>();
  const parsed = parse(cssString);

  for (const rule of parsed.stylesheet.rules) {
    let declaration: Declaration = {};

    for (const decl of rule.declarations) {
      if (decl.type !== "property" || !decl.name) continue;
      if (supported_attrs.includes(decl.name as DeclarationName)) {
        declaration[decl.name as DeclarationName] = decl.value!;
      }
    }

    for (const selector of rule.selectors) {
      colors.set(selector, declaration);
    }
  }

  return colors;
}

interface Token2 {
  text: string;
  color: string;
  backgroundColor?: string; // TODO
  textDecoration?: string;
  fontStyle?: string;
  fontWeight?: string;
}

export function getLineTokens2(
  htmlString: string,
  cssDecl: Map<string, Declaration>,
) {
  const normalColor = cssDecl.get(".hljs")?.color!;
  const doc = parseHTML(htmlString, "text/html");
  const lineEls = doc.getElementsByClassName(
    "code-line",
  ) as HTMLTableCellElement[];

  const lines: Token2[][] = [];

  for (const line of lineEls) {
    const children = line.childNodes as HTMLElement[];
    const lineTokens: Token2[] = [];
    for (const child of children) {
      const text = child.textContent as string;
      const classList = child.classList as Set<string> | undefined;

      if (!classList) {
        lineTokens.push({ text, color: normalColor });
        continue;
      }

      const classes = Array
        .from(classList.values())
        // .filter((c) => c !== "function_") // TODO: deal with these kind of things later.
        .map((c) => `.${c}`);

      const token: Token2 = { text, color: "" };

      for (const cls of classes) {
        const classProps = cssDecl.get(cls);

        if (!classProps) continue;

        if (classProps.color && !token.color) {
          token.color = classProps.color;
        }

        if (classProps["background-color"] && !token.backgroundColor) {
          token.backgroundColor = classProps["background-color"];
        }
        if (classProps["font-style"] && !token.fontStyle) {
          token.fontStyle = classProps["font-style"];
        }
        if (classProps["font-weight"] && !token.fontWeight) {
          token.fontWeight = classProps["font-weight"];
        }
        if (classProps["text-decoration"] && !token.textDecoration) {
          token.textDecoration = classProps["text-decoration"];
        }
      }

      if (!token.color) token.color = normalColor;

      lineTokens.push(token);
    }

    lines.push(lineTokens);
  }

  return lines;
}

// makeSVG2(htmlString, getColors2(cssString), 12);

export function makeSVG2(
  htmlString: string,
  declarations: Map<string, Declaration>,
  fontSize: number,
) {
  const fontProps = FONT_SIZE_PROPS[fontSize];
  if (!fontProps) {
    throw new Error(
      `Unsupported font size: ${fontSize}. No font properties found.`,
    );
  }

  const lines = getLineTokens2(htmlString, declarations);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg">\n`;

  let longestLineLength = fontProps.margin.left;

  let y = fontProps.margin.top; // 25;
  for (const line of lines) {
    let x = fontProps.margin.left; // 15;
    for (const token of line) {
      if (token.backgroundColor) {
        // TODO: implement logic. later, ese. Not needed rn.
        // Create rectangle, put it in the background of the <text>.
      }

      svg += `
      <text xml:space="preserve" text-rendering="geometricPrecision"
        x="${x}" y="${y}"
        font-size="${fontSize}" font-family="monospace"
        fill="${token.color}"`;

      if (token.fontStyle) {
        svg += ` font-style="${token.fontStyle}"`;
      }

      if (token.fontWeight) {
        const weight = parseInt(token.fontWeight);
        if (isNaN(weight)) {
          // normal, lighter, bold, bolder
        } else if (weight < 300) {
          svg += ` font-weight="lighter"`;
        } else if (weight > 400 && weight <= 700) {
          svg += ` font-weight="bold"`;
        } else {
          svg += ` font-weight="bolder"`;
        }
      }

      if (token.textDecoration) {
        svg += ` text-decoration="${token.textDecoration}"`;
      }

      svg += `\n    >${escape(token.text)}</text>`;
      x += token.text.length * fontProps.char_space; // 7.2;
    }

    y += fontProps.line_height; // 20;

    if (x > longestLineLength) {
      longestLineLength = x;
    }
  }

  // The bottom and right empty spacing.
  svg += `
  <text xml:space="preserve"
        x="${longestLineLength + fontProps.margin.right}"
        y="${y}"
        font-size="${fontSize}"
        font-family="monospace"
        text-rendering="geometricPrecision"
        fill="${declarations.get(".hljs")?.["background"]}"
  >.</text>`;

  svg += `\n</svg>`;
  // console.log(svg);
  return svg;
}

// 1) Create SVG class list and apply them.
// [1]. Check parent class and check if the spaced-split[0] is the class of it or not.
