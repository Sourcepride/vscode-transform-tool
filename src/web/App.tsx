import JsonToGraphql from "./features/JsonToGraphql";
import JsonToMongoose from "./features/JsonToMongoose";
import JsonToMysql from "./features/JsonToMySQL";
import JsonToTypescript from "./features/JsonToTypescript";
import JsonToZod from "./features/JsonToZod";
import JsObjectToJson from "./features/JsToJson";
import JsObjectToTypescript from "./features/JsToTypeScript";
import TomlToJson from "./features/TomlToJson";
import TomlToYaml from "./features/TomlToYamal";
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
    case "js_object_to_json":
      return <JsObjectToJson />;
    case "js_object_to_typescript":
      return <JsObjectToTypescript />;
    case "yaml_to_json":
      return <YamlToJson />;
    case "yaml_to_toml":
      return <YamlToToml />;
    case "toml_to_yamal":
      return <TomlToYaml />;
    case "toml_to_json":
      return <TomlToJson />;
  }
}

export default App;
