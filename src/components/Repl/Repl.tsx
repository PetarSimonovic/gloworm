import { CodeInput } from "../CodeInput/CodeInput";
import { CodeOutput } from "../CodeOutput/CodeOutput";

import "./Repl.scss";

export const Repl = () => {
  return (
    <div className="repl">
      <CodeInput />
      <CodeOutput />
    </div>
  );
};
