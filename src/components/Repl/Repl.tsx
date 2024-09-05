import { CodeInput } from "../CodeInput/CodeInput";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendPara } from "../../utils/displayHelper";

import "./Repl.scss";

export const Repl = () => {
  const onEnterPress = (command: string) => {
    appendPara(command, ".code-output");
  };

  return (
    <div className="repl">
      <CodeInput onEnterPress={onEnterPress} />
      <CodeOutput />
      <Button
        onClick={() => console.log("Click")}
        label="Connect to MicroPython"
      />
    </div>
  );
};
