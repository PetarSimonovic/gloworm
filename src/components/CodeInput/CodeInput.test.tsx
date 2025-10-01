import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CodeInput } from "./CodeInput";

describe("CodeInput", () => {
  let container: HTMLElement;
  let codeInputDiv: HTMLElement | null;
  let codeMirror: HTMLElement | null | undefined;
  const handleCodeChange = jest.fn();

  describe("when disconnected", () => {
    beforeEach(() => {
      const codeInput = render(
        <CodeInput handleCodeChange={handleCodeChange} connected={false} />
      );
      container = codeInput.container;
      codeInputDiv = container.querySelector(".code-input");
      codeMirror = codeInputDiv?.querySelector(".cm-theme");
    });

    it("should should not have the connected styles when disconnected", () => {
      expect(codeInputDiv).not.toHaveClass("code-input--connected");
    });

    it("should prompt the user to connect", () => {
      expect(container).toHaveTextContent("Connect to board");
    });

    it("should not display the code mirror", () => {
      expect(codeMirror).toBe(null);
    });
  });
  describe("when connected", () => {
    beforeEach(() => {
      const codeInput = render(
        <CodeInput handleCodeChange={handleCodeChange} connected={true} />
      );
      container = codeInput.container;
      codeInputDiv = container.querySelector(".code-input");
      codeMirror = codeInputDiv?.querySelector(".cm-theme");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should have the connected styles when disconnected", () => {
      expect(codeInputDiv).toHaveClass("code-input--connected");
    });

    it("should not prompt the user to connect", () => {
      expect(container).not.toHaveTextContent("Connect to board");
    });

    it("should display the code mirror", () => {
      expect(codeMirror).not.toBe(null);
    });
  });
});
