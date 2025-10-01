import { Repl } from "./Repl";
import { screen } from "@testing-library/react";

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

let container: HTMLElement;

// The node TextDecoder is not exactly the same type as the DOM TextDecoder
// When we use 'typeof' we're telling TypeScript to "trust me, this is compatible"
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
global.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;

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
    const connectButton = screen.getByText("Connect");
    expect(connectButton).not.toBe(null);

    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(connectButton?.textContent).toBe("Disconnect");
      expect(mockOpen).toHaveBeenCalled();
      expect(mockGetReader).toHaveBeenCalled();
      expect(mockGetWriter).toHaveBeenCalled();
    });
  });

  test("sendCodeToBoard: entering code when connected writes to and reads from the board", async () => {
    const connectButton = screen.getByText("Connect");

    fireEvent.click(connectButton!);

    await waitFor(() => {
      expect(connectButton?.textContent).toBe("Disconnect");
    });

    const runButton = screen.getByText("Run");
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockRead).toHaveBeenCalled();
    });
  });

  test("releasePort: disconnecting calls port.close and shows disconnect message", async () => {
    const button = screen.getByText("Connect");

    fireEvent.click(button!);

    await waitFor(() => {
      expect(button?.textContent).toBe("Disconnect");
    });
    // Wait for disconnect to complete

    fireEvent.click(button!);

    await waitFor(() => {
      expect(button?.textContent).toBe("Connect");
      expect(mockClose).toHaveBeenCalled();
      expect(mockWriterReleaseLock).toHaveBeenCalled();
      expect(mockReaderReleaseLock).toHaveBeenCalled();
    });
  });
});
