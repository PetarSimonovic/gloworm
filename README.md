# GloWorm

GloWorm is an in-browser tool that uses the [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) to connect and code MicroPython boards.

It's a work in progress and has been developed using a Raspberry Pi Pico. No other types of board have been tested.

The Web Serial API itself is an exprimental feature that isn't compatible with all browsers.

Chrome is recommended.

## Try it out

You'll need a MicroPython controller (the app has been tested only with a Raspberry Pi Pico).

Visit https://petarsimonovic.github.io/gloworm/

or run it locally

```bash
 npm install

 npm run start
```

GloWorm should be available on http://localhost:5173/

## Connecting a MicroPython board

Connect your computer to a MicroPythobn board (GloWorm has been tested only with a Raspberry Pi Pico)

Click the `connect` button.

When prompted, select `Board in FS mode`.

If the connection is succesful the output pane will state that it's `Connected to MicroPython`.

## Sending code to the board

Type code in the input pane at the top of the screen. Click `Run` to send it to the connected MicroPython board.

The board's response will appear in the Output pane below.

Making a board's onboard LED blink is the MicroPython equivalent of "Hello World".

Here's how to do it on a Pico.

```python
from machine import Pin
led = Pin(25, Pin.OUT)

led.toggle()
```

Subsequent calls to `led.toggle()` should make the light go on and off.

Use the `Stop` button to interrupt code that's in a loop, eg:

```python
from machine import Pin
import time 
led = Pin(25, Pin.OUT)

while True:
  led.toggle()
  time.sleep(0.5)
```

## Disconnecting

Click the disconnect button to disconnect from the board.

## Forthcoming work
- File storage to allow for larger projects
- Functionality to install libraries to boards
- More tests, refactoring etc
- Flickering glowing effects, possibly to indicate errors
- Accessibility testing/features to adjust colours
- Maybe host it somewhere
