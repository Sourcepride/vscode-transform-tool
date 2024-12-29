import { useRef, useState } from "react";
import useHeightChange from "../hooks/useHeigthChange";
import { editorOptions } from "../utils";
import EditorHeader from "./EditorHeader";
import MonacoWrapper from "./MonacoWrapper";

type EditorPanelProps = {
  changeHandler: (value: string) => void;
  defaultValue?: string;
  editable?: boolean;
  language: string;
};
const EditorPanel: React.FC<EditorPanelProps> = ({
  defaultValue,
  editable,
  language,
  changeHandler,
}) => {
  const oldValueRef = useRef(defaultValue);
  const [editorValue, setEditorValue] = useState(defaultValue || "");
  const options = editorOptions({ editable });
  const height = useHeightChange();

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
      <EditorHeader />

      <MonacoWrapper
        language={language}
        onChange={handleChange}
        options={options}
        value={editorValue}
        height={height}
      />
    </section>
  );
};

export default EditorPanel;
