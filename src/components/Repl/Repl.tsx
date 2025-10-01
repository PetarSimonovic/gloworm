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
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
  };

  const disconnectFromDevice = () => {
    try {
      portManager.disconnect();
    } catch (error) {
      console.log(error);
      appendContent("Error disconnecting from MicroPython", ".code-output");
    }
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
    if (portManager.hasPort()) {
      disconnectFromDevice();
      setIsConnected(false);
    } else {
      await portManager.connect();
      setIsConnected(portManager.hasPort());
    }
  };

  return (
    <div className="repl">
      <Heading connected={isConnected} />
      <CodeInput handleCodeChange={handleCodeChange} connected={isConnected} />
      {isConnected && (
        <Button
          connected={true}
          onClick={() => {
            // Join code lines and send to board
            sendCodeToBoard(code);
          }}
          label={"Run"}
        />
      )}
      <CodeOutput connected={isConnected} />
      <div className="repl__control-panel">
        <Button
          connected={isConnected}
          onClick={onClickHandleConnection}
          label={isConnected ? "Disconnect" : "Connect"}
        />
      </div>
    </div>
  );
};
