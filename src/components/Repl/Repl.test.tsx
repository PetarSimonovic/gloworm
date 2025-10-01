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
let connectButton: HTMLElement;

// The node TextDecoder is not exactly the same type as the DOM TextDecoder
// When we use 'typeof' we're telling TypeScript to "trust me, this is compatible"
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
global.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;

const clickConnect = async () => {
  await waitFor(() => {
    const connectButton = screen.getByText("Connect");
    fireEvent.click(connectButton);
  });
};
beforeAll(() => {
  setupMockSerial();
  window.HTMLElement.prototype.scrollTo = jest.fn();

  const codeOutput = document.createElement("div");
  codeOutput.className = "code-output";
  // Mock scrollTo so it doesn't throw in jsdom
  codeOutput.scrollTo = jest.fn();
  document.body.appendChild(codeOutput);
});

afterEach(() => {
  jest.clearAllMocks(); // Add this to reset mock call counts
});

describe("Repl", () => {
  beforeEach(() => {
    const rendered = render(<Repl />);
    container = rendered.container;
  });

  it("renders a CodeInput component", () => {
    const divElement = container.querySelector(".code-input");
    expect(divElement).not.toBeNull();
  });

  it("renders a CodeOutput component", () => {
    const divElement = container.querySelector(".code-output");
    expect(divElement).not.toBeNull();
  });

  describe("when connected to board", () => {
    beforeEach(async () => {
      await waitFor(() => {
        clickConnect();
      });
    });
    it("opens a connection", async () => {
      await waitFor(() => {
        expect(mockOpen).toHaveBeenCalled();
      });
    });

    it("obtains a reader", async () => {
      await waitFor(() => {
        expect(mockGetReader).toHaveBeenCalled();
      });
    });

    it("obtains a writer", async () => {
      await waitFor(() => {
        expect(mockGetWriter).toHaveBeenCalled();
      });
    });

    describe("when the Run button is clicked", () => {
      beforeEach(async () => {
        let runButton: HTMLElement;
        await waitFor(() => {
          runButton = screen.getByText("Run");
        });

        fireEvent.click(runButton!);
      });

      it("calls the writer", async () => {
        await waitFor(() => {
          expect(mockWrite).toHaveBeenCalled();
        });
      });

      it("calls the reader", async () => {
        await waitFor(() => {
          expect(mockRead).toHaveBeenCalled();
        });
      });
    });
  });

  describe("When the disconnect button is clicked", () => {
    beforeEach(async () => {
      clickConnect();
      let disconnectButton: HTMLElement;
      await waitFor(() => {
        disconnectButton = screen.getByText("Disconnect");
      });
      fireEvent.click(disconnectButton!);
    });

    it("releases the writer", async () => {
      await waitFor(() => {
        expect(mockWriterReleaseLock).toHaveBeenCalled();
      });
    });

    it("releases the writer", async () => {
      await waitFor(() => {
        expect(mockReaderReleaseLock).toHaveBeenCalled();
      });
    });

    it("closes the port", async () => {
      await waitFor(() => {
        expect(mockClose).toHaveBeenCalled();
      });
    });
  });
});
