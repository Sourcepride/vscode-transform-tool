import { Ban } from "lucide-react";

type ErrorMessageProps = {
  message?: string;
};
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <>
      {message && (
        <div className="fixed bottom-0 bg-[#1e8fff63] items-center left-0 w-full  py-2 px-4 flex gap-4 ">
          <div className="">
            <Ban color="red" size={18} />
          </div>
          <p className="grow">{message}</p>
        </div>
      )}
      ;
    </>
  );
};

export default ErrorMessage;
