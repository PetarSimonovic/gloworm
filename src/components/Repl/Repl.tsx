import { CodeInput } from "../CodeInput/CodeInput";
import { Heading } from "../Heading/Heading";
import { useState, useEffect } from "react";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendContent } from "../../lib/displayHelper";

import "./Repl.scss";

export const Repl = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [reader, setReader] =
    useState<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const [writer, setWriter] =
    useState<WritableStreamDefaultWriter<Uint8Array> | null>(null);

  useEffect(() => {
    const getReader = async () => {
      if (!port) {
        return;
      }
      const reader = await port.readable.getReader();
      setReader(reader);
    };
    getReader();
  }, [port]);

  useEffect(() => {
    const getWriter = async () => {
      if (!port) {
        return;
      }
      const writer = await port.writable.getWriter();
      setWriter(writer);
    };
    getWriter();
  }, [port]);

  useEffect(() => {
    if (!reader || !writer) {
      return;
    }
    appendContent("Connected to MicroPython", ".code-output");
  }, [reader, writer]);

  const connectToPort = async () => {
    const obtainedPort = await navigator.serial.requestPort();
    await obtainedPort.open({ baudRate: 115200 });
    setPort(obtainedPort);
  };

  const disconnectFromPort = async () => {
    try {
      await reader?.releaseLock();
      await writer?.releaseLock();
      await port?.close();
      setReader(null);
      setWriter(null);
      setPort(null);
      appendContent("Disconnected from MicroPython", ".code-output");
    } catch (error) {
      console.log(error);
      appendContent("Error disconnecting from MicroPython", ".code-output");
    }
  };

  const sendCodeToBoard = async (command: string) => {
    if (!writer && !reader) {
      appendContent("Please connect to MicroPython first.", ".code-output");
      return;
    }

    const encoder = new TextEncoder();
    await writer?.write(encoder.encode(command + "\r\n"));
    try {
      while (reader && true) {
        const { value, done } = await reader.read();
        if (done) {
          appendContent("done", ".code-output");

          break;
        }
        if (value) {
          const text = new TextDecoder().decode(value);
          appendContent(text, ".code-output");
        }
      }
    } catch (error) {
      console.error("Error reading from serial port:", error);
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
      <Heading connected={!!port} />
      <CodeInput onEnterPress={sendCodeToBoard} connected={!!port} />
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
