const CONFIG = {
  BACKGROUND_COLOR: [245, 240, 225],
  MIN_PETALS: 5,
  MAX_PETALS: 18,
  MIN_SCALE: 0.5,
  MAX_SCALE: 2.5,
  MIN_BLOOM_SPEED: 0.05,
  MAX_BLOOM_SPEED: 0.15,
  STEM_WIDTH: 5,
  MIN_SCALE_FOR_STEM: 0.1
};

const FLOWER_TYPES = {
  DAISY: 'daisy',
  ROSE: 'rose',
  SUNFLOWER: 'sunflower',
  TULIP: 'tulip',
  CHERRY_BLOSSOM: 'cherry_blossom'
};

const STEM_COLORS = [
  [34, 139, 34],
  [107, 142, 35],
  [85, 107, 47],
  [124, 252, 0],
  [144, 238, 144]
];

const CENTER_COLORS = [
  [255, 215, 0],
  [255, 140, 0],
  [139, 69, 19],
  [160, 82, 45],
  [210, 180, 140],
  [255, 228, 181]
];

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
let selectedFlowerType = 'random';
let showInstructions = true;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  angleMode(DEGREES);
  
  setupCanvasInteraction();
  setupFlowerSelector();
}

function setupCanvasInteraction() {
  canvas.elt.style.touchAction = "none";
  canvas.elt.addEventListener("pointerdown", handlePointerDown);
}

function setupFlowerSelector() {
  const selector = document.getElementById('flower-type');
  selector.addEventListener('change', function(e) {
    selectedFlowerType = e.target.value;
  });
}

function handlePointerDown(e) {
  const rect = canvas.elt.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  spawnFlower(x, y);
  showInstructions = false;
  e.preventDefault();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(...CONFIG.BACKGROUND_COLOR);
  updateAndDrawFlowers();
  
  if (showInstructions) {
    drawInstructions();
  }
}

function drawInstructions() {
  push();
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(100, 100, 100);
  text("Tap anywhere to grow a flower", width / 2, height / 2);
  pop();
}

function updateAndDrawFlowers() {
  for (const flower of flowers) {
    flower.bloom();
    flower.display();
  }
}

function spawnFlower(x, y) {
  const flowerType = selectedFlowerType === 'random' ? 
    random(Object.values(FLOWER_TYPES)) : 
    selectedFlowerType;
  const petals = floor(random(CONFIG.MIN_PETALS, CONFIG.MAX_PETALS));
  const petalColor = random(PETAL_COLORS);
  const stemColor = random(STEM_COLORS);
  const centerColor = random(CENTER_COLORS);
  const scale = random(CONFIG.MIN_SCALE, CONFIG.MAX_SCALE);
  const bloomSpeed = random(CONFIG.MIN_BLOOM_SPEED, CONFIG.MAX_BLOOM_SPEED);
  
  flowers.push(new Flower(x, y, flowerType, petals, petalColor, stemColor, centerColor, scale, bloomSpeed));
}

class Flower {
  constructor(x, y, type, numPetals, petalColor, stemColor, centerColor, targetScale, bloomSpeed) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.numPetals = numPetals;
    this.petalColor = petalColor;
    this.stemColor = stemColor;
    this.centerColor = centerColor;
    this.targetScale = targetScale;
    this.currentScale = 0;
    this.bloomSpeed = bloomSpeed;
    this.rotation = random(0, 360);
    this.petalSizes = this.getSymmetricPetalSizes();
  }
  
  getSymmetricPetalSizes() {
    const baseOuter = random(35, 45);
    const baseInner = random(18, 22);
    const baseOuterDistance = random(38, 42);
    const baseInnerDistance = random(20, 24);
    
    return {
      outer: baseOuter,
      inner: baseInner,
      outerDistance: baseOuterDistance,
      innerDistance: baseInnerDistance
    };
  }

  bloom() {
    this.currentScale = lerp(this.currentScale, this.targetScale, this.bloomSpeed);
    this.rotation += 0.2;
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
      stroke(...this.stemColor);
      strokeWeight(CONFIG.STEM_WIDTH * this.currentScale);
      
      if (this.type === FLOWER_TYPES.TULIP) {
        this.drawCurvedStem();
      } else {
        line(0, 0, 0, height - this.y);
      }
    }
  }
  
  drawCurvedStem() {
    noFill();
    beginShape();
    for (let i = 0; i <= height - this.y; i += 5) {
      const curve = sin(i * 0.02) * 10;
      vertex(curve, i);
    }
    endShape();
  }

  drawFlowerHead() {
    noStroke();
    scale(this.currentScale);
    rotate(this.rotation);
    
    switch (this.type) {
      case FLOWER_TYPES.DAISY:
        this.drawDaisyPetals();
        break;
      case FLOWER_TYPES.ROSE:
        this.drawRosePetals();
        break;
      case FLOWER_TYPES.SUNFLOWER:
        this.drawSunflowerPetals();
        break;
      case FLOWER_TYPES.TULIP:
        this.drawTulipPetals();
        break;
      case FLOWER_TYPES.CHERRY_BLOSSOM:
        this.drawCherryBlossomPetals();
        break;
      default:
        this.drawDefaultPetals();
    }
    
    this.drawCenter();
  }

  drawDaisyPetals() {
    push();
    fill(this.petalColor);
    for (let i = 0; i < this.numPetals; i++) {
      rotate(360 / this.numPetals);
      ellipse(0, -this.petalSizes.outerDistance, this.petalSizes.outer * 0.7, this.petalSizes.outer * 1.5);
    }
    pop();
  }
  
  drawRosePetals() {
    for (let layer = 0; layer < 3; layer++) {
      push();
      fill(red(this.petalColor[0]) - layer * 20, green(this.petalColor[1]) - layer * 15, blue(this.petalColor[2]) - layer * 10);
      for (let i = 0; i < this.numPetals; i++) {
        rotate(360 / this.numPetals);
        const size = this.petalSizes.outer - layer * 8;
        const distance = this.petalSizes.outerDistance - layer * 12;
        ellipse(0, -distance, size, size);
      }
      pop();
    }
  }
  
  drawSunflowerPetals() {
    push();
    fill(this.petalColor);
    for (let i = 0; i < this.numPetals; i++) {
      rotate(360 / this.numPetals);
      ellipse(0, -this.petalSizes.outerDistance, this.petalSizes.outer * 0.5, this.petalSizes.outer * 2);
    }
    pop();
  }
  
  drawTulipPetals() {
    push();
    fill(this.petalColor);
    for (let i = 0; i < 6; i++) {
      rotate(60);
      ellipse(0, -25, 20, 35);
    }
    pop();
  }
  
  drawCherryBlossomPetals() {
    push();
    fill(this.petalColor);
    for (let i = 0; i < 5; i++) {
      rotate(72);
      beginShape();
      vertex(0, -30);
      bezierVertex(-8, -35, -15, -25, -10, -15);
      bezierVertex(-5, -20, 5, -20, 10, -15);
      bezierVertex(15, -25, 8, -35, 0, -30);
      endShape(CLOSE);
    }
    pop();
  }
  
  drawDefaultPetals() {
    push();
    fill(this.petalColor);
    for (let i = 0; i < this.numPetals; i++) {
      rotate(360 / this.numPetals);
      ellipse(0, -this.petalSizes.outerDistance, this.petalSizes.outer, this.petalSizes.outer);
    }
    pop();
    
    push();
    fill(255, 206, 84, 150);
    for (let i = 0; i < this.numPetals; i++) {
      rotate(360 / this.numPetals);
      ellipse(0, -this.petalSizes.innerDistance, this.petalSizes.inner, this.petalSizes.inner);
    }
    pop();
  }

  drawCenter() {
    let centerSize;
    
    switch (this.type) {
      case FLOWER_TYPES.SUNFLOWER:
        centerSize = 35;
        break;
      case FLOWER_TYPES.DAISY:
        centerSize = 25;
        break;
      case FLOWER_TYPES.ROSE:
        centerSize = 20;
        break;
      case FLOWER_TYPES.TULIP:
        centerSize = 15;
        break;
      case FLOWER_TYPES.CHERRY_BLOSSOM:
        centerSize = 18;
        break;
      default:
        centerSize = 25;
    }
    
    if (this.type === FLOWER_TYPES.SUNFLOWER) {
      this.drawSunflowerCenter(centerSize);
    } else {
      fill(...this.centerColor);
      ellipse(0, 0, centerSize, centerSize);
      
      if (this.type === FLOWER_TYPES.DAISY) {
        fill(255, 255, 255, 100);
        ellipse(0, 0, centerSize * 0.6, centerSize * 0.6);
      }
    }
  }
  
  drawSunflowerCenter(size) {
    fill(...this.centerColor);
    ellipse(0, 0, size, size);
    
    fill(139, 69, 19);
    for (let i = 0; i < 20; i++) {
      const angle = i * 18;
      const x = cos(angle) * (size * 0.15);
      const y = sin(angle) * (size * 0.15);
      ellipse(x, y, 3, 3);
    }
  }
}