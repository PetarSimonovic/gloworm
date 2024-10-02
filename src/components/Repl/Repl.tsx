import { CodeInput } from "../CodeInput/CodeInput";
import { useState, useEffect } from "react";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendPara } from "../../utils/displayHelper";

import "./Repl.scss";

export const Repl = () => {
  const [port, setPort] = useState<SerialPort | null>(null);

  const onEnterPress = (command: string) => {
    appendPara(command, ".code-output");
  };

  const onClickConnect = async () => {
    appendPara("Connecting to MicroPython...", ".code-output");
    const obtainedPort = await navigator.serial.requestPort();
    console.log(obtainedPort);
    await obtainedPort.open({ baudRate: 115200 });
    setPort(obtainedPort);
  };

  useEffect(() => {
    const checkMicroPython = async (port: SerialPort) => {
      const writer = port.writable.getWriter();
      const reader = port.readable.getReader();

      // Send a simple MicroPython command
      const command = 'print("Hello, MicroPython!")\r\n';
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(command));

      let finalValue;

      // Read the response
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          finalValue = value;
          break;
        }
        if (value) {
          const text = new TextDecoder().decode(value);
          appendPara(text, ".code-output");
        }
      }
      const textDecoder = new TextDecoder();
      const decodedValue = textDecoder.decode(finalValue);
      console.log(decodedValue);

      if (decodedValue.includes("Hello, MicroPython!")) {
        appendPara("MicroPython detected!", ".code-output");
      } else {
        appendPara("MicroPython not detected.", ".code-output");
      }

      reader.releaseLock();
      writer.releaseLock();
    };

    if (port) {
      checkMicroPython(port);
    }
  }, [port]);

  return (
    <div className="repl">
      <CodeInput onEnterPress={onEnterPress} />
      <CodeOutput />
      <Button onClick={onClickConnect} label="Connect to MicroPython" />
    </div>
  );
};
