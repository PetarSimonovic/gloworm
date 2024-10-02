import { expect, describe, test, beforeEach } from "bun:test";
import { render } from "@testing-library/react";

import { Repl } from "./Repl";

let container: HTMLElement;

describe("Repl", () => {
  beforeEach(() => {
    const rendered = render(<Repl />);
    container = rendered.container;
  });

  test("renders a CodeInput component", () => {
    const divElement = container.querySelector(".code-input");
    expect(divElement).not.toBeNull();
  });

  test("renders a CodeOutput component", () => {
    const divElement = container.querySelector(".code-output");
    expect(divElement).not.toBeNull();
  });
});
