import initRuff, { format as formatPython } from "@wasm-fmt/ruff_fmt/web";
import { prettifyCore } from "./prettifyCore";

let ruffInit: Promise<void> | null = null;

function ensureRuffInit(): Promise<void> {
  if (!ruffInit) {
    const wasmUrl =
      typeof window !== "undefined" ? window.__TRANSFORM_RUFF_WASM__ : undefined;
    // `./vite` + `?init` resolves WASM from the JS chunk’s `import.meta.url`, which is wrong in a
    // VS Code webview (empty fetch → "BufferSource argument is empty"). `./web` + explicit URL fixes it.
    ruffInit = initRuff(wasmUrl).then(() => undefined);
  }
  return ruffInit;
}

/**
 * Full formatter: Prettier/sql/json/go/java in `prettifyCore`, Python via Ruff WASM on the **main thread**
 * (blob workers break Ruff; WASM URL comes from `window.__TRANSFORM_RUFF_WASM__` in the webview HTML).
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
