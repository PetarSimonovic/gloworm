import { render, fireEvent } from "@testing-library/react";

import { CodeInput } from "./CodeInput";
const onEnterPress = jest.fn();

let container: HTMLElement;
let codeInput: HTMLTextAreaElement;

beforeAll(() => {
  window.HTMLElement.prototype.scrollTo = jest.fn();

  const codeOutput = document.createElement("div");
  codeOutput.className = "code-output";
  // Mock scrollTo so it doesn't throw in jsdom
  codeOutput.scrollTo = jest.fn();
  document.body.appendChild(codeOutput);
});

describe("CodeInput", () => {
  beforeEach(() => {
    const rendered = render(
      <CodeInput onEnterPress={onEnterPress} connected={false} />
    );
    container = rendered.container;
    codeInput = container.querySelector(".code-input")!;
  });
  test("renders a textarea", () => {
    expect(codeInput).not.toBeNull();
  });

  describe("when Enter key is pressed", () => {
    test("adds a new line", () => {
      fireEvent.change(codeInput!, { target: { value: "Hello" } });
      expect(codeInput!.value).toBe("Hello");

      fireEvent.keyDown(codeInput!, { key: "Enter" });
      expect(codeInput!.value).toBe("Hello\n\n");
    });

    test("passes the first line entered to onEnterPress", () => {
      fireEvent.change(codeInput!, { target: { value: "Hello world" } });
      // check onEnterPress is called
      fireEvent.keyDown(codeInput!, { key: "Enter" });
      expect(onEnterPress).toHaveBeenCalledWith("Hello world");
    });

    test("passes only the last line entered to onEnterPress", () => {
      fireEvent.change(codeInput!, {
        target: { value: "Hello world\nStart coding" },
      });
      // check onEnterPress is called
      fireEvent.keyDown(codeInput!, { key: "Enter" });
      expect(onEnterPress).toHaveBeenCalledWith("Start coding");
    });
  });
});
