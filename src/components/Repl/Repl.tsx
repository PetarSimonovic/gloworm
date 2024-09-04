import { CodeInput } from "../CodeInput/CodeInput";
import { CodeOutput } from "../CodeOutput/CodeOutput";

import "./Repl.scss";

export const Repl = () => {
  const onEnterPress = (value: string) => {
    console.log("REPL");
    console.log(value);
  };

  return (
    <div className="repl">
      <CodeInput onEnterPress={onEnterPress} />
      <CodeOutput />
    </div>
  );
};
