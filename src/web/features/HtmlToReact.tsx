import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `
<div class="card">
  <h1>Title</h1>
  <p>Hello from HTML</p>
</div>
`;

const HtmlToReact = () => {
  const transformer = ({ value }: { value: string }) =>
    Promise.resolve(transformers.html_to_react(value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="HTML to React (TSX)"
      language="html"
      resultTitle="TSX"
      resultLanguage="typescript"
      defaultValue={DEFAULT.trim()}
    />
  );
};

export default HtmlToReact;
