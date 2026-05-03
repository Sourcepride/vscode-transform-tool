import initRuff, { format as formatPython } from "@wasm-fmt/ruff_fmt/vite";
import { prettifyCore } from "./prettifyCore";

let ruffInit: Promise<void> | null = null;

function ensureRuffInit(): Promise<void> {
  if (!ruffInit) {
    ruffInit = initRuff().then(() => undefined);
  }
  return ruffInit;
}

/**
 * Full formatter: Prettier/sql/json/go/java in `prettifyCore`, Python via Ruff WASM on the **main thread**
 * (blob workers break Ruff’s WASM `fetch` / `import.meta.url` resolution in VS Code webviews).
 */
export async function prettify(language: string, value: string) {
  const lang = (language || "").toLowerCase();
  if (lang === "python") {
    await ensureRuffInit();
    try {
      return await formatPython(value, "snippet.py", {
        indent_style: "space",
        indent_width: 4,
        line_width: 88,
        quote_style: "double",
        magic_trailing_comma: "respect",
      });
    } catch (e) {
      throw new Error(
        `Python format (Ruff): ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }
  return prettifyCore(language, value);
}
