import { render } from "@testing-library/react";

import { CodeOutput } from "./CodeOutput";

describe("CodeInput", () => {
  test("renders a textarea", () => {
    const { container } = render(<CodeOutput connected={false} />);
    const divElement = container.querySelector(".code-output");
    expect(divElement).not.toBeNull();
  });
});
