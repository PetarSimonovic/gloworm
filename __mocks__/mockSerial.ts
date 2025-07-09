export const mockClose = jest.fn().mockResolvedValue(undefined);
export const mockOpen = jest.fn().mockResolvedValue(undefined);
export const mockWrite = jest.fn();
export const mockRead = jest.fn().mockResolvedValue({ value: "", done: true });
export const mockReaderReleaseLock = jest.fn();
export const mockWriterReleaseLock = jest.fn();

export const mockGetReader = jest.fn().mockReturnValue({
  releaseLock: mockReaderReleaseLock,
  read: mockRead,
});
export const mockGetWriter = jest.fn().mockReturnValue({
  releaseLock: mockWriterReleaseLock,
  write: mockWrite,
});

export const setupMockSerial = () => {
  Object.defineProperty(global.navigator, "serial", {
    value: {
      requestPort: jest.fn().mockResolvedValue({
        open: mockOpen,
        readable: { getReader: mockGetReader },
        writable: { getWriter: mockGetWriter },
        close: mockClose,
      }),
    },
    configurable: true,
  });
};
