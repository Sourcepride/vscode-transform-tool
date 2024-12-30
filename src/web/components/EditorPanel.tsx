import { useRef, useState } from "react";
import useHeightChange from "../hooks/useHeigthChange";
import useSettings from "../hooks/useSettings";
import { editorOptions } from "../utils";
import EditorHeader from "./EditorHeader";
import MonacoWrapper from "./MonacoWrapper";

type EditorPanelProps = {
  title?: string;
  changeHandler: (value: string) => void;
  defaultValue?: string;
  editable?: boolean;
  language: string;
};
const EditorPanel: React.FC<EditorPanelProps> = ({
  title,
  defaultValue,
  editable,
  language,
  changeHandler,
}) => {
  const oldValueRef = useRef(defaultValue);
  const [editorValue, setEditorValue] = useState(defaultValue || "");
  const height = useHeightChange();
  const settings = useSettings();

  const options = editorOptions({
    editable,
    fontWeight: settings.fontWeight,
    fontFamily: settings.fontFamily,
    fontSize: settings.fontSize,
    renderValidationDecorations: title ? "on" : "off",
  });

  const handleChange = (value: string | undefined) => {
    setEditorValue(value || "");
    changeHandler(value || "");
  };

  if (oldValueRef.current !== defaultValue) {
    oldValueRef.current = defaultValue;
    setEditorValue(defaultValue || editorValue);
  }

  return (
    <section className="w-full">
      <EditorHeader
        title={title}
        language={language}
        setCurrentValue={setEditorValue}
        currentValue={editorValue}
      />

      <MonacoWrapper
        language={language}
        onChange={handleChange}
        options={options}
        value={editorValue}
        height={height - 52}
      />
    </section>
  );
};

export default EditorPanel;
