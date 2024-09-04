import { expect, describe, test } from "bun:test";
import { render } from "@testing-library/react";

import { CodeOutput } from "./CodeOutput";

describe("CodeInput", () => {
  test("renders a textarea", () => {
    const { container } = render(<CodeOutput />);
    const divElement = container.querySelector(".code-output");
    expect(divElement).not.toBeNull();
  });
});
