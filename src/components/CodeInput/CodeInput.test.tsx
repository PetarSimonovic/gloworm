import { expect, describe, test, mock, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";

import { CodeInput } from "./CodeInput";
const onEnterPress = mock();

let container: HTMLElement;

describe("CodeInput", () => {
  beforeEach(() => {
    const rendered = render(<CodeInput onEnterPress={onEnterPress} />);
    container = rendered.container;
  });
  test("renders a textarea", () => {
    const textarea = container.querySelector("textarea");
    expect(textarea).not.toBeNull();
  });

  describe("when Enter key is pressed", () => {
    test("should add a new line", () => {
      const textarea = container.querySelector("textarea");

      fireEvent.change(textarea!, { target: { value: "Hello" } });
      expect(textarea!.value).toBe("Hello");

      fireEvent.keyDown(textarea!, { key: "Enter" });
      expect(textarea!.value).toBe("Hello\n");
    });

    test("should call onEnterPress", () => {
      const textarea = container.querySelector("textarea");

      fireEvent.change(textarea!, { target: { value: "Hello" } });

      // check onEnterPress is called
      fireEvent.keyDown(textarea!, { key: "Enter" });
      expect(onEnterPress).toHaveBeenCalledWith("Hello\n");
    });
  });
});
