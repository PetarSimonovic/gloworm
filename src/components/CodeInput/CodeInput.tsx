import { useState } from "react";

import "./CodeInput.scss";

interface CodeInputProps {
  onEnterPress: (value: string) => void;
  connected: boolean;
}

export const CodeInput = ({ onEnterPress, connected }: CodeInputProps) => {
  const [code, setCode] = useState("");

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
      onEnterPress(lastLineOfCode());
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  return (
    <>
      <textarea
        className={`code-input ${connected ? "code-input--connected" : ""}`}
        onChange={handleChange}
        value={code}
        onKeyDown={handleKeyDown}
      />
    </>
  );
};
