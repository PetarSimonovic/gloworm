import { expect, it, describe, test, mock } from "bun:test";
import { render, fireEvent } from "@testing-library/react";

import { CodeInput } from "./CodeInput";
const onEnterPress = mock();

describe("CodeInput", () => {
  test("renders a textarea", () => {
    const { container } = render(<CodeInput onEnterPress={onEnterPress} />);
    const textarea = container.querySelector("textarea");
    expect(textarea).not.toBeNull();
  });

  test("when Enter key is pressed", () => {
    it("should add a new line", () => {
      const { container } = render(<CodeInput onEnterPress={onEnterPress} />);
      const textarea = container.querySelector("textarea");

      fireEvent.change(textarea!, { target: { value: "Hello" } });
      expect(textarea!.value).toBe("Hello");

      fireEvent.keyDown(textarea!, { key: "Enter" });
      expect(textarea!.value).toBe("Hello\n");
    });
  });
});
