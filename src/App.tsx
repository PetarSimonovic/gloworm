import { useState } from "react";
import { CodeInput } from "./components/CodeInput/CodeInput";
import { CodeOutput } from "./components/CodeOutput/CodeOutput";
import "./App.css";

function App() {
  return (
    <>
      <CodeInput />
      <CodeOutput />
    </>
  );
}

export default App;
