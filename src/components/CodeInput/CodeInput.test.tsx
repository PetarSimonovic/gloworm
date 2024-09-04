import { expect, describe, test, mock, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";

import { CodeInput } from "./CodeInput";
const onEnterPress = mock();

let container: HTMLElement;
let textarea: HTMLTextAreaElement;

describe("CodeInput", () => {
  beforeEach(() => {
    const rendered = render(<CodeInput onEnterPress={onEnterPress} />);
    container = rendered.container;
    textarea = container.querySelector("textarea")!;
  });
  test("renders a textarea", () => {
    expect(textarea).not.toBeNull();
  });

  describe("when Enter key is pressed", () => {
    test("adds a new line", () => {
      fireEvent.change(textarea!, { target: { value: "Hello" } });
      expect(textarea!.value).toBe("Hello");

      fireEvent.keyDown(textarea!, { key: "Enter" });
      expect(textarea!.value).toBe("Hello\n");
    });

    test("calls onEnterPress", () => {
      fireEvent.change(textarea!, { target: { value: "Hello" } });

      // check onEnterPress is called
      fireEvent.keyDown(textarea!, { key: "Enter" });
      expect(onEnterPress).toHaveBeenCalledWith("Hello\n");
    });
  });
});
