import CssToTailwind from "./features/CssToTailwind";
import CsvToJson from "./features/CsvToJson";
import CurlToCode from "./features/CurlToCode";
import HtmlToReact from "./features/HtmlToReact";
import JsonToCsv from "./features/JsonToCsv";
import JsonToEnv from "./features/JsonToEnv";
import JsonToGraphql from "./features/JsonToGraphql";
import JsonToMongoose from "./features/JsonToMongoose";
import JsonToMysql from "./features/JsonToMySQL";
import JsonToTypescript from "./features/JsonToTypescript";
import JsonToZod from "./features/JsonToZod";
import JsObjectToJson from "./features/JsToJson";
import JsObjectToTypescript from "./features/JsToTypeScript";
import TomlToJson from "./features/TomlToJson";
import TomlToYaml from "./features/TomlToYamal";
import YamlToEnv from "./features/YamlToEnv";
import YamlToJson from "./features/YamlToJson";
import YamlToToml from "./features/YamlToToml";
import useSettings from "./hooks/useSettings";

function App() {
  const settings = useSettings();

  switch (settings.tool) {
    case "json_to_typescript":
      return <JsonToTypescript />;
    case "json_to_zod":
      return <JsonToZod />;
    case "json_to_mysql":
      return <JsonToMysql />;
    case "json_to_mongoose":
      return <JsonToMongoose />;
    case "json_to_graphql":
      return <JsonToGraphql />;
    case "json_to_env":
      return <JsonToEnv />;
    case "json_to_csv":
      return <JsonToCsv />;
    case "js_object_to_json":
      return <JsObjectToJson />;
    case "js_object_to_typescript":
      return <JsObjectToTypescript />;
    case "html_to_react":
      return <HtmlToReact />;
    case "css_to_tailwind":
      return <CssToTailwind />;
    case "csv_to_json":
      return <CsvToJson />;
    case "yaml_to_json":
      return <YamlToJson />;
    case "yaml_to_env":
      return <YamlToEnv />;
    case "yaml_to_toml":
      return <YamlToToml />;
    case "toml_to_yamal":
      return <TomlToYaml />;
    case "toml_to_json":
      return <TomlToJson />;
    case "curl_to_node_axios":
      return (
        <CurlToCode
          tool="curl_to_node_axios"
          title="cURL to Node (axios)"
          resultTitle="Node (axios)"
          resultLanguage="typescript"
        />
      );
    case "curl_to_node":
      return (
        <CurlToCode
          tool="curl_to_node"
          title="cURL to Node (fetch)"
          resultTitle="Node (fetch)"
          resultLanguage="typescript"
        />
      );
    case "curl_to_python":
      return (
        <CurlToCode
          tool="curl_to_python"
          title="cURL to Python (requests)"
          resultTitle="Python"
          resultLanguage="python"
        />
      );
    case "curl_to_go":
      return (
        <CurlToCode
          tool="curl_to_go"
          title="cURL to Go"
          resultTitle="Go"
          resultLanguage="go"
        />
      );
    case "curl_to_java":
      return (
        <CurlToCode
          tool="curl_to_java"
          title="cURL to Java"
          resultTitle="Java"
          resultLanguage="java"
        />
      );
  }
}

export default App;
