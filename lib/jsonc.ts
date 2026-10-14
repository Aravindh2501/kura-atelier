/**
 * Tiny JSONC parser: JSON + // comments + /* block comments *\/ + trailing commas.
 * String-aware, so "https://..." URLs are never mistaken for comments.
 */
export function parseJsonc<T = unknown>(source: string): T {
  let out = "";
  let inString = false;
  let i = 0;

  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];

    if (inString) {
      out += c;
      if (c === "\\") {
        out += next ?? "";
        i += 2;
        continue;
      }
      if (c === '"') inString = false;
      i++;
      continue;
    }

    if (c === '"') {
      inString = true;
      out += c;
      i++;
    } else if (c === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i++;
    } else if (c === "/" && next === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i++;
      i += 2;
    } else {
      out += c;
      i++;
    }
  }

  return JSON.parse(removeTrailingCommas(out)) as T;
}

function removeTrailingCommas(json: string): string {
  let out = "";
  let inString = false;

  for (let i = 0; i < json.length; i++) {
    const c = json[i];
    if (inString) {
      out += c;
      if (c === "\\") out += json[++i] ?? "";
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      out += c;
      continue;
    }
    if (c === ",") {
      let j = i + 1;
      while (j < json.length && /\s/.test(json[j])) j++;
      if (json[j] === "}" || json[j] === "]") continue; // drop the trailing comma
    }
    out += c;
  }
  return out;
}
