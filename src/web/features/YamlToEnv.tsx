import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `NODE_ENV: development
PORT: 3000
API_BASE_URL: https://api.example.com`;

export default function YamlToEnv() {
  const transformer = ({ value }: { value: string }) =>
    Promise.resolve(transformers["yaml_to_env"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="YAML to .env"
      language="yaml"
      resultTitle="Environment"
      resultLanguage="bash"
      defaultValue={DEFAULT.trim()}
    />
  );
}
