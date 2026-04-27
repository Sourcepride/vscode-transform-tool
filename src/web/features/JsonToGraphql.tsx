import { transformers } from "@/src/transformers";
import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `
{
  "name": "Okoro Patience",
  "department": "SLT"
}
`;

export default function JsonToGraphql() {
  const transformer = useCallback(async ({ value }: { value: string }) => {
    return transformers["json_to_graphql"](value);
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to graphql"
      language="json"
      resultTitle="GraphQL"
      resultLanguage={"graphql"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
