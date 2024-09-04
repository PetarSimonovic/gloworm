import "./CodeOutput.scss";

interface CodeOutputProps {
  displayOutput: (output: string) => void;
}

export const CodeOutput = ({ displayOutput }: CodeOutputProps) => {
  return (
    <>
      <div className="code-output"></div>
    </>
  );
};
