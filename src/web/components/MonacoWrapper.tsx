import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useRef } from "react";
import Loading from "./Loading";

const vscode = acquireVsCodeApi();

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

  useEffect(() => {
    if (monaco && !monacoRef.current) {
      monacoRef.current = monaco as any;
    }
  }, [monaco]);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    monaco.editor.setTheme("vs-dark"); // TODO:  use vscode default theme
    monacoRef.current = editor;
  }

  console.log("========--------------------------", vscode);

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
