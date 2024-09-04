import { CodeInput } from "../CodeInput/CodeInput";
import { CodeOutput } from "../CodeOutput/CodeOutput";

import "./Repl.scss";

export const Repl = () => {
  const displayOutput = (command: string) => {
    // add a new paragraph within the parent div

    const newParagraph = document.createElement("p");
    newParagraph.textContent = command;
    const codeOutput = document.querySelector(".code-output");
    codeOutput?.appendChild(newParagraph);
  };
  const onEnterPress = (command: string) => {
    displayOutput(command);
  };

  return (
    <div className="repl">
      <CodeInput onEnterPress={onEnterPress} />
      <CodeOutput />
    </div>
  );
};
