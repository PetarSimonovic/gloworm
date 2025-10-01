export class PortManager {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader | null = null;
  private writer: WritableStreamDefaultWriter | null = null;

  private carriageReturn = "\r";
  private newLine = "\n";

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
      this.setWriter();
    } catch (e) {
      console.log("Port connection failure", e);
    }
    return this.port || null;
  }

  public async read(): Promise<ReadableStreamReadResult<Uint8Array>> {
    return this.reader!.read();
  }

  public async write(code: Array<string>): Promise<void> {
    const encoder = new TextEncoder();
    code.forEach(async (line) => {
      const formattedLine = line + this.carriageReturn;
      await this.writer?.write(encoder.encode(formattedLine));
    });
    await this.writer?.write(
      encoder.encode(this.carriageReturn + this.newLine)
    );
  }

  public hasPort(): boolean {
    return !!this.port;
  }

  public hasReader(): boolean {
    return !!this.reader;
  }

  public hasWriter(): boolean {
    return !!this.writer;
  }

  public getPort(): SerialPort | null {
    return this.port;
  }

  public canReadAndWrite(): boolean {
    return !!this.reader && !!this.writer;
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

  private setWriter(): void {
    this.writer = this.port?.writable.getWriter() || null;
  }

  public releaseWriter(): void {
    this.writer?.releaseLock();
    this.writer = null;
  }
}
