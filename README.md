# AetherFlow Productivity System & Calendar

A modern, fast, single-page calendar application designed for high productivity. Built with semantic HTML5, CSS Custom Properties, and vanilla modern JavaScript.

## Features

- **Smooth View Zoom Transitions**: Effortlessly zoom in and out between Day, Week, Month, and Year views using the native **CSS View Transitions API** (with elegant scale-and-fade animations).
- **Overlapping Task Layout**: Implements column-based placement logic so overlapping tasks are rendered side-by-side cleanly without stacking.
- **Live Current Time Indicator Line**: A pulsing timeline runs across the Day and active Week column, indicating your exact progress.
- **Pomodoro Focus Timer**: An interactive SVG circular progress indicator to manage work blocks (25 mins) and break periods (5 mins).
- **Task Management**: Full CRUD interface using native modal overlays (`<dialog>`), persisting state in `localStorage`.
- **High Aesthetics**: Midnight-dark UI theme, neon indigo/violet gradients, and blur glassmorphism filters.

## How to Run

1. Make this directory your active workspace in your code editor:
   `/Users/happypipaliya/.gemini/antigravity/scratch/productivity-calendar`
2. Open `index.html` directly in a browser, or run a simple local web server:
   - Using Python: `python3 -m http.server 8000` and visit `http://localhost:8000`
   - Using Node: `npx serve` and visit the generated localhost link.
