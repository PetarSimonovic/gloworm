import "./CodeOutput.scss";

interface CodeInputProps {
  connected: boolean;
}

export const CodeOutput = ({ connected }: CodeInputProps) => {
  return (
    <>
      <div
        className={`code-output ${connected ? "code-output--connected" : ""}`}
      ></div>
    </>
  );
};
