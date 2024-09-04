import { useState } from "react";

import "./CodeInput.scss";

interface CodeInputProps {
  onEnterPress: (value: string) => void;
}

export const CodeInput = ({ onEnterPress }: CodeInputProps) => {
  const [code, setCode] = useState("");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const { selectionStart, selectionEnd, value } = event.currentTarget;
      event.currentTarget.value =
        value.substring(0, selectionStart) +
        "\n" +
        value.substring(selectionEnd);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    console.log(code);
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
