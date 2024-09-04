import { expect, describe, test } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";

import { CodeInput } from "./CodeInput";

describe("CodeInput", () => {
  test("renders a textarea", () => {
    const { container } = render(<CodeInput />);
    const textarea = container.querySelector("textarea");
    expect(textarea).not.toBeNull();
  });
});
