# Slow Worm

Slow Worm is an in-browser tool that uses the Web Serial API to connect and code MicroPython boards.

It's a work in progress and the Web Serial API itself is an exprimental feature that isn't compatible with all browsers. 

Chrome offers full support.



## Installation

```bash
 npm install

 npm run dev
```

Slow Worm should be available on http://localhost:5173/

## Connecting a Pico

Connect a Pico to your computer. Click the `connect` button.

When prompted, select `Board in FS mode`.

If the connection is succesful the output pane will state that it's `Connected to MicroPython`

## Coding a Pico

Type a line of code in the input pane at the top of the screen then press return to send it to the Pico.

The Pico's response will appear in the Output pane below.

Making a Pico's onboard LED blink is the MicroPython equivalent of "Hello World".

```python
from machine import Pin
led = Pin(25, Pin.OUT)

led.toggle()
```

Subsequent calls to `led.toggle()` should make the light go on and off.

## Disconnecting

Click the disconnect button to disconnect from the board.

## Forthcoming work

- string indentation to help format MicroPython code (string indentation works at the moment but it's tempremental)
- more tests, refactoring etc
- flickering glowing effects, possibly to indicate errors
  
