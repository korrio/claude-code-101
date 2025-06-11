const CONFIG = {
  BACKGROUND_COLOR: [245, 240, 225],
  STEM_COLOR: [160, 212, 104],
  INNER_PETAL_COLOR: [255, 206, 84],
  CENTER_COLOR: [246, 166, 35],
  MIN_PETALS: 8,
  MAX_PETALS: 16,
  MIN_SCALE: 0.7,
  MAX_SCALE: 2,
  BLOOM_SPEED: 0.1,
  STEM_WIDTH: 5,
  OUTER_PETAL_SIZE: 40,
  INNER_PETAL_SIZE: 20,
  CENTER_SIZE: 25,
  OUTER_PETAL_DISTANCE: 40,
  INNER_PETAL_DISTANCE: 20,
  MIN_SCALE_FOR_STEM: 0.1
};

const PETAL_COLORS = [
  [255, 182, 193],
  [152, 251, 152],
  [255, 240, 181],
  [221, 160, 221],
  [255, 183, 122],
  [175, 238, 238],
  [255, 127, 80],
  [199, 21, 133],
  [240, 230, 140],
  [135, 206, 250],
  [255, 218, 185],
  [60, 179, 113],
  [221, 45, 74],
  [242, 106, 141],
  [240, 128, 128],
  [255, 89, 94],
];

let flowers = [];
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  angleMode(DEGREES);
  
  setupCanvasInteraction();
}

function setupCanvasInteraction() {
  canvas.elt.style.touchAction = "none";
  canvas.elt.addEventListener("pointerdown", handlePointerDown);
}

function handlePointerDown(e) {
  const rect = canvas.elt.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  spawnFlower(x, y);
  e.preventDefault();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(...CONFIG.BACKGROUND_COLOR);
  updateAndDrawFlowers();
}

function updateAndDrawFlowers() {
  for (const flower of flowers) {
    flower.bloom();
    flower.display();
  }
}

function spawnFlower(x, y) {
  const petals = floor(random(CONFIG.MIN_PETALS, CONFIG.MAX_PETALS));
  const color = random(PETAL_COLORS);
  const scale = random(CONFIG.MIN_SCALE, CONFIG.MAX_SCALE);
  flowers.push(new Flower(x, y, petals, color, scale));
}

class Flower {
  constructor(x, y, numPetals, petalColor, targetScale) {
    this.x = x;
    this.y = y;
    this.numPetals = numPetals;
    this.petalColor = petalColor;
    this.targetScale = targetScale;
    this.currentScale = 0;
  }

  bloom() {
    this.currentScale = lerp(this.currentScale, this.targetScale, CONFIG.BLOOM_SPEED);
  }

  display() {
    push();
    translate(this.x, this.y);
    
    this.drawStem();
    this.drawFlowerHead();
    
    pop();
  }

  drawStem() {
    if (this.currentScale > CONFIG.MIN_SCALE_FOR_STEM) {
      stroke(...CONFIG.STEM_COLOR);
      strokeWeight(CONFIG.STEM_WIDTH * this.currentScale);
      line(0, 0, 0, height - this.y);
    }
  }

  drawFlowerHead() {
    noStroke();
    scale(this.currentScale);
    
    this.drawOuterPetals();
    this.drawInnerPetals();
    this.drawCenter();
  }

  drawOuterPetals() {
    push();
    fill(this.petalColor);
    for (let i = 0; i < this.numPetals; i++) {
      rotate(360 / this.numPetals);
      ellipse(0, -CONFIG.OUTER_PETAL_DISTANCE, CONFIG.OUTER_PETAL_SIZE, CONFIG.OUTER_PETAL_SIZE);
    }
    pop();
  }

  drawInnerPetals() {
    push();
    fill(...CONFIG.INNER_PETAL_COLOR);
    for (let i = 0; i < this.numPetals; i++) {
      rotate(360 / this.numPetals);
      ellipse(0, -CONFIG.INNER_PETAL_DISTANCE, CONFIG.INNER_PETAL_SIZE, CONFIG.INNER_PETAL_SIZE);
    }
    pop();
  }

  drawCenter() {
    fill(...CONFIG.CENTER_COLOR);
    ellipse(0, 0, CONFIG.CENTER_SIZE, CONFIG.CENTER_SIZE);
  }
}