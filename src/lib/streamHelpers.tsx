export const obtainWriter = async (port: SerialPort) => {
  let writer: WritableStreamDefaultWriter<Uint8Array> | null;
  try {
    writer = await port.writable.getWriter();
  } catch (error) {
    console.log(error);
    writer = null;
  }
  return writer;
};

export const obtainReader = async (port: SerialPort) => {
  let reader: ReadableStreamDefaultReader<Uint8Array> | null;
  try {
    reader = await port.readable.getReader();
  } catch (error) {
    console.log(error);
    reader = null;
  }
  return reader;
};
