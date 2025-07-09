import { render, fireEvent, waitFor } from "@testing-library/react";
import { TextEncoder, TextDecoder } from "util";

import { Repl } from "./Repl";

let container: HTMLElement;
let mockClose: jest.Mock;
let mockOpen: jest.Mock;
let mockGetReader: jest.Mock;
let mockGetWriter: jest.Mock;
let mockWriterReleaseLock: jest.Mock;
let mockReaderReleaseLock: jest.Mock;
let mockWrite: jest.Mock;
let mockRead: jest.Mock;

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeAll(() => {
  // port.open and port.close are async so the mocks need
  // to return a Promise
  mockClose = jest.fn().mockResolvedValue(undefined);
  mockOpen = jest.fn().mockResolvedValue(undefined);

  mockWrite = jest.fn();
  mockRead = jest.fn();

  mockReaderReleaseLock = jest.fn();
  mockWriterReleaseLock = jest.fn();
  mockGetReader = jest
    .fn()
    .mockReturnValue({ releaseLock: mockReaderReleaseLock, read: mockRead });

  mockGetWriter = jest
    .fn()
    .mockReturnValue({ releaseLock: mockWriterReleaseLock, write: mockWrite });

  Object.defineProperty(global.navigator, "serial", {
    value: {
      requestPort: jest.fn().mockResolvedValue({
        open: mockOpen,
        readable: {
          getReader: mockGetReader,
        },
        writable: {
          getWriter: mockGetWriter,
        },
        close: mockClose,
      }),
    },
    configurable: true,
  });
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
