import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `name,age,city
Alice,30,"New York, NY"
Bob,25,Los Angeles`;

export default function CsvToJson() {
  const transformer = ({ value }: { value: string }) =>
    Promise.resolve(transformers["csv_to_json"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="CSV to JSON"
      language="plaintext"
      resultTitle="JSON"
      resultLanguage="json"
      defaultValue={DEFAULT.trim()}
    />
  );
}
