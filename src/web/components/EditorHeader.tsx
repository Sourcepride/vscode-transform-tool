import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/ui/tooltip";
import { Copy, Trash } from "lucide-react";

type EditorHeaderProps = {
  title?: string;
  language: string;
  currentValue: string;
  setCurrentValue: (val: string) => void;
};
const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  language,
  setCurrentValue,
  currentValue,
}) => {
  const handleCopy = () => {
    window.navigator.clipboard.writeText(currentValue);
  };

  return (
    <header className={`flex flex-col gap-2 px-8 w-[98%] lg:flex-row `}>
      <div>
        {title && <h1 className="font-bold  text-lg "> {title}</h1>}
        <p className="py-1 capitalize">{language}</p>
      </div>
      <div className="flex gap-4  py-2 lg:ml-auto">
        {title && (
          <div>
            <CustomTooltip text="clear">
              <button
                onClick={() => setCurrentValue("")}
                className="[appearance:none]"
                type="button"
              >
                <Trash size={16} />
              </button>
            </CustomTooltip>
          </div>
        )}
        {
          <div>
            {title ? (
              <CustomTooltip text="copy">
                <button
                  onClick={handleCopy}
                  className="[appearance:none]"
                  type="button"
                >
                  <Copy size={16} />
                </button>
              </CustomTooltip>
            ) : (
              <Button onClick={handleCopy} className="bg-[#1e90ff]" size={"sm"}>
                Copy Result
              </Button>
            )}
          </div>
        }
      </div>
    </header>
  );
};

export default EditorHeader;
