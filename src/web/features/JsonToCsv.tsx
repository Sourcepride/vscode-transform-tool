import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `[
  { "name": "Alice", "age": 30, "city": "NYC" },
  { "name": "Bob", "age": 25, "city": "LA" }
]`;

export default function JsonToCsv() {
  const transformer = ({ value }: { value: string }) =>
    Promise.resolve(transformers["json_to_csv"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to CSV"
      language="json"
      resultTitle="CSV"
      resultLanguage="plaintext"
      defaultValue={DEFAULT.trim()}
    />
  );
}
