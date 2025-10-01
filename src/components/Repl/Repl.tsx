import { CodeInput } from "../CodeInput/CodeInput";
import { Heading } from "../Heading/Heading";
import { useState, useEffect } from "react";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendContent } from "../../lib/displayHelper";

import "./Repl.scss";
import { PortManager } from "../../lib/portManager";

export const Repl = () => {
  const [portManager] = useState<PortManager>(new PortManager());
  const [code, setCode] = useState<string[]>([]);
  const [port, setPort] = useState<SerialPort | null>(null);

  // const softReboot = "\x04";
  // const interrupt = "\x03";

  useEffect(() => {
    if (!portManager.canReadAndWrite()) {
      return;
    }
    appendContent("Connected to MicroPython", ".code-output");
  }, [portManager]);

  const handleCodeChange = (value: string) => {
    setCode(value.split("\n"));
    console.log(code);
  };

  const releasePort = async () => {
    await port?.close();
    setPort(null);
    appendContent("Disconnected from MicroPython", ".code-output");
  };

  const disconnectFromDevice = async () => {
    try {
      await portManager.releaseWriter();
      await portManager.releaseReader();
      await releasePort();
    } catch (error) {
      console.log(error);
      appendContent("Error disconnecting from MicroPython", ".code-output");
    } finally {
      purgePorts();
    }
  };

  const purgePorts = () => {
    setPort(null);
  };

  const readFromBoard = async () => {
    try {
      while (portManager.hasReader() && true) {
        const { value, done } = await portManager.read();
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
      purgePorts();
    }
  };

  const sendCodeToBoard = async (code: Array<string>) => {
    if (!portManager.canReadAndWrite()) {
      appendContent("Please connect to MicroPython first.", ".code-output");
      return;
    }

    await portManager.write(code);
    await readFromBoard();
  };

  const onClickHandleConnection = async () => {
    if (port) {
      disconnectFromDevice();
    } else {
      const obtainedPort = await portManager.connect();
      setPort(obtainedPort);
    }
  };

  return (
    <div className="repl">
      <Heading connected={!!port} />
      <CodeInput handleCodeChange={handleCodeChange} connected={!!port} />
      <Button
        connected={!!port}
        onClick={() => {
          // Join code lines and send to board
          sendCodeToBoard(code);
        }}
        label={!port ? "" : "Run"}
      />
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
