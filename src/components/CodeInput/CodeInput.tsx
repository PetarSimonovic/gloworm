import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";
import { python } from "@codemirror/lang-python";
import "./CodeInput.scss";

interface CodeInputProps {
  handleCodeChange: (value: string) => void;
  connected: boolean;
}

export const CodeInput = ({ handleCodeChange, connected }: CodeInputProps) => {
  return (
    <>
      <div className={`code-input ${connected ? "code-input--connected" : ""}`}>
        {connected ? (
          <CodeMirror
            onChange={handleCodeChange}
            extensions={[python()]}
            theme={monokai}
            value={""}
          />
        ) : (
          "Connect to board"
        )}
      </div>
    </>
  );
};
