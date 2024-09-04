import { expect, describe, test, mock } from "bun:test";
import { render, fireEvent } from "@testing-library/react";

import { CodeInput } from "./CodeInput";
const onEnterPress = mock();

describe("CodeInput", () => {
  test("renders a textarea", () => {
    const { container } = render(<CodeInput onEnterPress={onEnterPress} />);
    const textarea = container.querySelector("textarea");
    expect(textarea).not.toBeNull();
  });

  test("should add a new line when Enter key is pressed", () => {
    const { container } = render(<CodeInput onEnterPress={onEnterPress} />);
    const textarea = container.querySelector("textarea");

    fireEvent.change(textarea!, { target: { value: "Hello" } });
    expect(textarea!.value).toBe("Hello");

    fireEvent.keyDown(textarea!, { key: "Enter" });
    expect(textarea!.value).toBe("Hello\n");
  });
});
