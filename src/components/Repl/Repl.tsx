import { CodeInput } from "../CodeInput/CodeInput";
import { useState, useEffect } from "react";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendPara } from "../../utils/displayHelper";

import "./Repl.scss";

export const Repl = () => {
  const [port, setPort] = useState<SerialPort | null>(null);

  const onEnterPress = async (command: string) => {
    if (!port) {
      appendPara("Please connect to MicroPython first.", ".code-output");
      return;
    }

    const writer = await port.writable.getWriter();
    let reader;
    try {
      reader = await port.readable.getReader();
    } catch (error) {
      console.log(error);
    }
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(command + "\r\n"));
    await writer.releaseLock();
    if (!reader) return;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          appendPara("done", ".code-output");

          break;
        }
        if (value) {
          const text = new TextDecoder().decode(value);
          appendPara(text, ".code-output");
        }
      }
    } catch (error) {
      console.error("Error reading from serial port:", error);
    } finally {
      await reader?.releaseLock();
      await writer?.releaseLock();
    }
  };

  const onClickConnect = async () => {
    appendPara("Connected to MicroPython...", ".code-output");
    const obtainedPort = await navigator.serial.requestPort();
    console.log(obtainedPort);
    await obtainedPort.open({ baudRate: 115200 });
    setPort(obtainedPort);
  };

  return (
    <div className="repl">
      <CodeInput onEnterPress={onEnterPress} connected={!!port} />
      <CodeOutput connected={!!port} />
      <Button
        onClick={onClickConnect}
        label={!port ? "Connect to MicroPython" : "Disconnect from MicroPython"}
      />
    </div>
  );
};
