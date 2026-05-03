import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `body {
  width: 100%;
  height: 50%;
  margin: 0 !important;
  background-color: transparent;
}`;

const CssToTailwind = () => {
  const transformer = ({ value }: { value: string }) =>
    Promise.resolve(transformers.css_to_tailwind(value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="CSS to Tailwind"
      language="css"
      resultTitle="Tailwind classes"
      resultLanguage="plaintext"
      defaultValue={DEFAULT.trim()}
    />
  );
};

export default CssToTailwind;
