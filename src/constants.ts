export const NAV = {
  Json: [
    "json_to_typescript",
    "json_to_zod",
    "json_to_graphql",
    "json_to_mysql",
    "json_to_mongoose",
  ] as const,
  Javascript: ["js_object_to_json", "js_object_to_typescript"] as const,
  Others: [
    "yaml_to_json",
    "yaml_to_toml",
    "toml_to_yamal",
    "toml_to_json",
  ] as const,
};

export const combinedToolsArray = Array.from(Object.values(NAV)).flat();
