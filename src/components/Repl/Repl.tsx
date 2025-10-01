import { useState, useEffect } from "react";
import { CodeInput } from "../CodeInput/CodeInput";
import { Heading } from "../Heading/Heading";
import { CodeOutput } from "../CodeOutput/CodeOutput";
import { Button } from "../Button/Button";
import { appendContent } from "../../lib/displayHelper";
import { PortManager } from "../../lib/portManager";

import "./Repl.scss";

export const Repl = () => {
  const [portManager] = useState<PortManager>(new PortManager());
  const [code, setCode] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const softReboot = "\x04";
  const interrupt = "\x03";
  const newLine = "\n";
  const carriageReturn = "\r";

  useEffect(() => {
    if (!portManager.canReadAndWrite()) {
      return;
    }
    appendContent("Connected to MicroPython", ".code-output");
  }, [portManager]);

  const handleCodeChange = (value: string) => {
    setCode(value.split("\n"));
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

  const sendInterrupt = async () => {
    if (!portManager.canReadAndWrite()) {
      return;
    }
    console.log("Interrupt");
    await portManager.write([interrupt]);
  };

  const onClickHandleConnection = async () => {
    if (portManager.hasPort()) {
      portManager.disconnect();
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
        <div className="control-panel">
          <Button
            connected={true}
            onClick={() => {
              sendCodeToBoard(code);
            }}
            label={"Run"}
          />
          <Button connected={true} onClick={sendInterrupt} label={"Stop"} />
        </div>
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
