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

    test("passes the first line entered to onEnterPress", () => {
      fireEvent.change(textarea!, { target: { value: "Hello world" } });
      // check onEnterPress is called
      fireEvent.keyDown(textarea!, { key: "Enter" });
      expect(onEnterPress).toHaveBeenCalledWith("Hello world\n");
    });

    test("passes only the last line entered to onEnterPress", () => {
      fireEvent.change(textarea!, {
        target: { value: "Hello world\nStart coding" },
      });
      // check onEnterPress is called
      fireEvent.keyDown(textarea!, { key: "Enter" });
      expect(onEnterPress).toHaveBeenCalledWith("Start coding\n");
    });
  });
});
