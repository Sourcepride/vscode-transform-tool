import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useRef } from "react";
import useSettings from "../hooks/useSettings";
import Loading from "./Loading";

// const vscode = acquireVsCodeApi();

const THEME_MAP = {
  dark: "vs-dark",
  light: "vs-light",
  constract: "hc-black",
  "constract-light": "hc-light",
};

interface MonacoWrapperProps {
  theme?: string;
  language?: string;
  value?: string;
  width?: number | string;
  height?: number | string;
  options?: any;
  defaultValue?: string;
  onChange: (value?: string) => void;
}

export const MonacoWrapper: React.FC<MonacoWrapperProps> = ({
  language,
  value,
  defaultValue,
  height,
  width,
  options,
  onChange,
}) => {
  const monacoRef = useRef(null);
  const monaco = useMonaco();
  const settings = useSettings();

  useEffect(() => {
    // ASSIGN MONACO REFERENCE
    if (monaco && !monacoRef.current) {
      monacoRef.current = monaco as any;
    }

    // SET NEW THEME IF USER TOGGLES THEME
    if (monaco) {
      monaco.editor.setTheme(THEME_MAP[settings.currentTheme] || "vs-dark");
    }
  }, [monaco, settings]);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    monaco.editor.setTheme(THEME_MAP[settings.currentTheme] || "vs-dark"); // TODO:  use vscode default theme
    monacoRef.current = editor;
  }

  return (
    <Editor
      defaultLanguage={language}
      defaultValue={defaultValue}
      value={value}
      height={height}
      width={width}
      options={options}
      onChange={onChange}
      loading={<Loading />}
      onMount={handleEditorDidMount}
    />
  );
};

export default MonacoWrapper;
