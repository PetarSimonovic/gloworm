import { useEffect, useRef } from "react";
import "./CodeOutput.scss";

interface CodeInputProps {
  connected: boolean;
}

export const CodeOutput = ({ connected }: CodeInputProps) => {
  const codeOutputRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={codeOutputRef}
        className={`code-output ${connected ? "code-output--connected" : ""}`}
      ></div>
    </>
  );
};
