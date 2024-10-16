import { CodeInput } from "../CodeInput/CodeInput";
import { useState, useEffect } from "react";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendPara, scrollIntoView } from "../../lib/displayHelper";

import "./Repl.scss";

export const Repl = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [reader, setReader] =
    useState<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  useEffect(() => {
    const getReader = async () => {
      if (!port) {
        return;
      }
      appendPara("Connected to MicroPython...", ".code-output");
      const reader = await port.readable.getReader();
      setReader(reader);
    };
    getReader();
  }, [port]);

  const connectToPort = async () => {
    const obtainedPort = await navigator.serial.requestPort();
    await obtainedPort.open({ baudRate: 115200 });
    setPort(obtainedPort);
  };

  const disconnectFromPort = async () => {
    try {
      await reader?.releaseLock();
      await port?.close();
      setReader(null);
      setPort(null);
      appendPara("Disconnected from MicroPython", ".code-output");
    } catch (error) {
      console.log(error);
      appendPara("Error disconnecting from MicroPython", ".code-output");
    }
  };

  const onEnterPress = async (command: string) => {
    if (!port) {
      appendPara("Please connect to MicroPython first.", ".code-output");
      return;
    }

    const writer = await port.writable.getWriter();
    if (!reader) {
      try {
        const obtainedReader = await port.readable.getReader();
        setReader(obtainedReader);
      } catch (error) {
        console.log(error);
      }
    }
    const encoder = new TextEncoder();
    await writer.write(encoder.encode(command + "\r\n"));
    await writer.releaseLock();
    try {
      while (reader && true) {
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

  const onClickHandleConnection = async () => {
    if (port) {
      disconnectFromPort();
    } else {
      connectToPort();
    }
  };

  return (
    <div className="repl">
      <h1
        className={`title ${port ? "title--connected" : "title--disconnected"}`}
      >
        Slow Worm{" "}
      </h1>
      <CodeInput onEnterPress={onEnterPress} connected={!!port} />
      <CodeOutput connected={!!port} />
      <div className="repl__control-panel">
        <Button
          connected={!!port}
          onClick={onClickHandleConnection}
          label={!port ? "Connect" : "Disconnect"}
        />
      </div>
    </div>
  );
};
