import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `{
  "NODE_ENV": "development",
  "PORT": 3000,
  "API_BASE_URL": "https://api.example.com"
}`;

export default function JsonToEnv() {
  const transformer = ({ value }: { value: string }) =>
    Promise.resolve(transformers["json_to_env"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to .env"
      language="json"
      resultTitle="Environment"
      resultLanguage="bash"
      defaultValue={DEFAULT.trim()}
    />
  );
}
