# Flower Animation Project

An interactive flower animation built with p5.js that creates beautiful blooming flowers when you click or tap on the screen.

## Features

- **Interactive Flower Creation**: Click or tap anywhere on the screen to spawn a new flower
- **Responsive Design**: Full-window canvas that adapts to screen size
- **Smooth Animations**: Flowers bloom with a smooth scaling animation
- **Varied Flower Types**: Each flower has a random number of petals (8-16) and color
- **Touch Support**: Works on both desktop and mobile devices

## Project Structure

```
claude-code-101/
├── public/
│   ├── index.html    # Main HTML file
│   └── app.js        # p5.js application code
└── README.md
```

## Code Improvements Made

### Refactoring Changes
1. **Configuration Object**: Extracted all magic numbers and colors into a centralized `CONFIG` object
2. **Constants**: Separated petal colors into `PETAL_COLORS` constant
3. **Function Organization**: Split setup functionality into focused functions:
   - `setupCanvasInteraction()` - Handles canvas touch/click setup
   - `handlePointerDown()` - Processes pointer events
   - `updateAndDrawFlowers()` - Manages flower rendering loop
4. **Improved Flower Class**: Restructured with separate methods:
   - `drawStem()` - Renders flower stem
   - `drawFlowerHead()` - Coordinates flower head rendering
   - `drawOuterPetals()` - Renders outer petal layer
   - `drawInnerPetals()` - Renders inner petal layer
   - `drawCenter()` - Renders flower center
5. **Modern JavaScript**: Used `const`/`let` appropriately and modern syntax

### Firebase Setup
- Organized files into `public/` directory for Firebase hosting
- Ready for Firebase deployment

## How to Run

1. Open `public/index.html` in a web browser
2. Click or tap anywhere to create flowers
3. Watch them bloom and grow!

## Technologies Used

- **p5.js**: Creative coding library for animations and graphics
- **HTML5 Canvas**: For rendering the flower graphics
- **Firebase** (ready for hosting): For web deployment