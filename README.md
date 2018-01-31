## What is this?

Matey is a bare-bones 2d animation tool intended for quickly roughing out your
ideas with as few obstacles and bewildering choices as possible. No fancy pens
or brushes. Just simple lines.

Pen strokes are vector based, allowing for a reduced memory footprint and file
size, as well as the ability to manipulate them after they have been put to
paper.

Animations can be exported as animated GIF - more formats are coming.

## Important

Please keep in mind that Matey is a work in progress and as such, some features
are not yet functional. There will also be bugs - probably lots of them.

## Installation

Electron and Node.js are required.

```sh
npm install
```

## Running

```sh
electron .
```

## Usage instructions

### Shortcut keys

| shortcut | description |
| ------------- |:-------------:|
| N      | Create a new frame |
| Shift + N      | Dupicate current frame |
| B      | Pen tool |
| L      | Line tool |
| P      | Polygon tool |
| Q      | Pointer tool |
| H      | Hand tool |
| Z      | Zoom tool |
| ,      | Previous frame |
| .      | Next frame |
| [      | Bring selected strokes forward |
| ]      | Push selected strokes back |
| Delete, Backspace | Delete selected strokes |
| Space + Drag | Pan the canvas |
| Ctrl + Backspace | Delete current frame |
| Ctrl + Z | Undo last action |
| Ctrl + Shift + Z | Redo last action |


## Planned features

 - SVG support (loading and exporting)
 - Export to video (MPEG-4 etc. via ffmpeg)
