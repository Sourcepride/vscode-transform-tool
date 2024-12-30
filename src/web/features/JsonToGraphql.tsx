import { jsonToSchema } from "@walmartlabs/json-to-simple-graphql-schema/lib";
import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

export default function JsonToGraphql() {
  const transformer = useCallback(({ value }: { value: string }) => {
    return jsonToSchema({ jsonInput: value }).value;
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to graphql"
      language="json"
      resultTitle="GraphQL"
      resultLanguage={"graphql"}
    />
  );
}
