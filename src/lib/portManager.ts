export class PortManager {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader | null = null;

  constructor() {
    // Initialize with no port connection
  }

  // Getter to check if we have a port
  public isConnected(): boolean {
    return this.port !== null;
  }

  // Getter to access the port (if needed)
  public async connect(): Promise<SerialPort | null> {
    try {
      const obtainedPort = await navigator.serial.requestPort();
      await obtainedPort.open({ baudRate: 115200 });
      this.port = obtainedPort;
      this.setReader();
    } catch (e) {
      console.log("Port connection failure", e);
    }
    return this.port || null;
  }

  public async read(): Promise<ReadableStreamReadResult<Uint8Array>> {
    return this.reader!.read();
  }

  public hasPort(): boolean {
    return !!this.port;
  }

  public hasReader(): boolean {
    return !!this.reader;
  }

  public getPort(): SerialPort | null {
    return this.port;
  }

  public getReader(): ReadableStreamDefaultReader | null {
    return this.reader;
  }

  public releaseReader(): void {
    this.reader?.releaseLock();
    this.reader = null;
  }

  private setReader(): void {
    this.reader = this.port?.readable.getReader() || null;
  }
}
