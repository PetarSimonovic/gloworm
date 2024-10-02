import { CodeInput } from "../CodeInput/CodeInput";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendPara } from "../../utils/displayHelper";

import "./Repl.scss";

export const Repl = () => {
  const onEnterPress = (command: string) => {
    appendPara(command, ".code-output");
  };

  const onClickConnect = async () => {
    appendPara("Connecting to MicroPython...", ".code-output");
    const obtainedPort = await navigator.serial.requestPort();
    await obtainedPort.open({ baudRate: 115200 });
    appendPara(`Connected to ${obtainedPort}`, ".code-output");
  };

  return (
    <div className="repl">
      <CodeInput onEnterPress={onEnterPress} />
      <CodeOutput />
      <Button onClick={onClickConnect} label="Connect to MicroPython" />
    </div>
  );
};
