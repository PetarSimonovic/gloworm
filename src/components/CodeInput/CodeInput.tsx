import { useState } from "react";

import "./CodeInput.scss";

interface CodeInputProps {
  onEnterPress: (value: string) => void;
}

export const CodeInput = ({ onEnterPress }: CodeInputProps) => {
  const [code, setCode] = useState("");
  const [lines, setLines] = useState<string[]>([]);

  const lastLineOfCode = () => {
    return code.split("\n").pop() || "";
  };

  const addLineBreakToCode = () => {
    setCode((prev) => prev + "\n");
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addLineBreakToCode();
      onEnterPress(lastLineOfCode() + "\n");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  return (
    <>
      <textarea
        className="code-input"
        onChange={handleChange}
        value={code}
        onKeyDown={handleKeyDown}
      />
    </>
  );
};
