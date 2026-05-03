/**
 * Browser build of curlconverter expects tree-sitter WASM at absolute "/…" paths.
 * VS Code webviews only serve extension files at `asWebviewUri` URLs; Vite `?url`
 * imports often become paths that return 403. The host injects canonical URIs on
 * `window` (see getMainHtmlContent) before this module runs.
 */
import Parser from "web-tree-sitter";
import fallbackTreeSitterWasmUrl from "web-tree-sitter/tree-sitter.wasm?url";
import fallbackTreeSitterBashWasmUrl from "curlconverter/dist/tree-sitter-bash.wasm?url";

const treeSitterWasmUrl =
  typeof window !== "undefined" && window.__TRANSFORM_TREE_SITTER_WASM__
    ? window.__TRANSFORM_TREE_SITTER_WASM__
    : String(fallbackTreeSitterWasmUrl);

const treeSitterBashWasmUrl =
  typeof window !== "undefined" && window.__TRANSFORM_TREE_SITTER_BASH_WASM__
    ? window.__TRANSFORM_TREE_SITTER_BASH_WASM__
    : String(fallbackTreeSitterBashWasmUrl);

await Parser.init({
  locateFile() {
    return treeSitterWasmUrl;
  },
});

const Bash = await Parser.Language.load(treeSitterBashWasmUrl);
const parser = new Parser();
parser.setLanguage(Bash);

export default parser;
