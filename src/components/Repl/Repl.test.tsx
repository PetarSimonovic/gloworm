import { render, fireEvent, waitFor } from "@testing-library/react";
import { TextEncoder, TextDecoder } from "util";
import {
  setupMockSerial,
  mockOpen,
  mockClose,
  mockGetReader,
  mockGetWriter,
  mockWrite,
  mockRead,
  mockWriterReleaseLock,
  mockReaderReleaseLock,
} from "../../../__mocks__/mockSerial";

import { Repl } from "./Repl";

let container: HTMLElement;

global.TextEncoder = TextEncoder;

// The node TextDecoder is not exactly the same type as the DOM TextDecoder
// When we use 'typeof' we're telling TypeScript to "trust me, this is compatible"
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

beforeAll(() => {
  setupMockSerial();
  window.HTMLElement.prototype.scrollTo = jest.fn();

  const codeOutput = document.createElement("div");
  codeOutput.className = "code-output";
  // Mock scrollTo so it doesn't throw in jsdom
  codeOutput.scrollTo = jest.fn();
  document.body.appendChild(codeOutput);
});

describe("Repl", () => {
  beforeEach(() => {
    const rendered = render(<Repl />);
    container = rendered.container;
  });

  test("renders a CodeInput component", () => {
    const divElement = container.querySelector(".code-input");
    expect(divElement).not.toBeNull();
  });

  test("renders a CodeOutput component", () => {
    const divElement = container.querySelector(".code-output");
    expect(divElement).not.toBeNull();
  });

  test("connectToPort: clicking the button changes label to 'Disconnect'", async () => {
    const button = container.querySelector("button");
    expect(button?.textContent).toBe("Connect");

    fireEvent.click(button!);

    await waitFor(() => {
      expect(button?.textContent).toBe("Disconnect");
      expect(mockOpen).toHaveBeenCalled();
      expect(mockGetReader).toHaveBeenCalled();
      expect(mockGetWriter).toHaveBeenCalled();
    });
  });

  test("sendCodeToBoard: entering code when connected writes to and reads from the board", async () => {
    const button = container.querySelector("button");
    expect(button?.textContent).toBe("Connect");

    fireEvent.click(button!);

    await waitFor(() => {
      expect(button?.textContent).toBe("Disconnect");
    });

    const codeInput = container.querySelector(".code-input");
    fireEvent.change(codeInput!, { target: { value: "print('Hello')" } });
    fireEvent.keyDown(codeInput!, { key: "Enter" });

    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalledWith(
        new TextEncoder().encode("print('Hello')\r\n")
      );
    });
    await waitFor(() => {
      expect(mockRead).toHaveBeenCalled();
    });
  });

  test("releasePort: disconnecting calls port.close and shows disconnect message", async () => {
    const button = container.querySelector("button");
    fireEvent.click(button!);
    await waitFor(() => {
      expect(button?.textContent).toBe("Disconnect");
    });

    // Disconnect
    fireEvent.click(button!);

    // Wait for disconnect to complete

    await waitFor(() => {
      expect(button?.textContent).toBe("Connect");

      expect(mockClose).toHaveBeenCalled();
      expect(mockWriterReleaseLock).toHaveBeenCalled();
      expect(mockReaderReleaseLock).toHaveBeenCalled();
    });
  });
});
