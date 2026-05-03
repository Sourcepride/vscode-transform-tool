import { transformers } from "@/src/transformers";
import type { TransformInput } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `curl https://httpbin.org/get \\
  -H "Accept: application/json"`;

type CurlTool = Extract<
  TransformInput,
  | "curl_to_node_axios"
  | "curl_to_node"
  | "curl_to_python"
  | "curl_to_go"
  | "curl_to_java"
>;

type Props = {
  tool: CurlTool;
  title: string;
  resultTitle: string;
  resultLanguage: string;
};

export default function CurlToCode({
  tool,
  title,
  resultTitle,
  resultLanguage,
}: Props) {
  const transformer = ({ value }: { value: string }) =>
    Promise.resolve(transformers[tool](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title={title}
      language="shell"
      resultTitle={resultTitle}
      resultLanguage={resultLanguage}
      defaultValue={DEFAULT.trim()}
    />
  );
}
