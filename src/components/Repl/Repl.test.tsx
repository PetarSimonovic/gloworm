import { expect, describe, test } from "bun:test";
import { render } from "@testing-library/react";

import { Repl } from "./Repl";

describe("CodeInput", () => {
  const { container } = render(<Repl />);

  test("renders a CodeInput component", () => {
    const divElement = container.querySelector(".code-input");
    expect(divElement).not.toBeNull();
  });

  test("renders a CodeOutput component", () => {
    const divElement = container.querySelector(".code-output");
    expect(divElement).not.toBeNull();
  });
});
