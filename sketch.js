
let rotY = 0;
let rotX = -0.12;

let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

const steps = 80;
const rings = 35;

let heartVertices = [];
let heartColors = [];

function setup() {
  createCanvas(260, 200, WEBGL);
  noStroke();

  randomSeed(12);
  buildHeart();
}

function buildHeart() {
  heartVertices = [];
  heartColors = [];

  for (let j = 0; j <= rings; j++) {
    let r = j / rings;
    let dome = pow(max(0, 1 - r * r), 0.55);
    let depth = 22 * dome;

    let rowFront = [];
    let rowBack = [];
    let colorRowFront = [];
    let colorRowBack = [];

    for (let i = 0; i <= steps; i++) {
      let t = TWO_PI * i / steps;

      let x = 16 * pow(sin(t), 3);

      let y =
        13 * cos(t)
        - 5 * cos(2 * t)
        - 2 * cos(3 * t)
        - cos(4 * t);

      let px = x * r * 2.8;
      let py = -y * r * 2.8;

      // 하트 아래쪽 꼬리
      let bottomPoint = constrain((-y - 5) / 18, 0, 1);
      px -= 24 * bottomPoint * bottomPoint * r;

      // 입체감
      let bulge = 1 + 0.03 * dome;
      px *= bulge;
      py *= bulge;

      rowFront.push([px, py, depth]);
      rowBack.push([px, py, -depth]);

      // 하트 중앙에 가로로 얇은 하얀 영역
      let horizontalBand =
        abs(py - 5) < 7 &&
        abs(px) < 31;

      let c = horizontalBand
        ? [251, 255, 255]
        : [150, 0, 24];

      colorRowFront.push(c);
      colorRowBack.push(c);
    }

    heartVertices.push({
      front: rowFront,
      back: rowBack
    });

    heartColors.push({
      front: colorRowFront,
      back: colorRowBack
    });
  }
}

function drawHeartSurface(side) {
  for (let j = 0; j < rings; j++) {
    beginShape(TRIANGLE_STRIP);

    for (let i = 0; i <= steps; i++) {
      let a = heartVertices[j][side][i];
      let b = heartVertices[j + 1][side][i];

      let ca = heartColors[j][side][i];
      let cb = heartColors[j + 1][side][i];

      fill(ca[0], ca[1], ca[2]);
      vertex(a[0], a[1], a[2]);

      fill(cb[0], cb[1], cb[2]);
      vertex(b[0], b[1], b[2]);
    }

    endShape();
  }
}

function draw() {
  background(255);

  // 자동 회전
  if (!isDragging) {
    rotY += 0.02;
  }

  push();

  rotateX(rotX);
  rotateY(rotY);

  drawHeartSurface("front");
  drawHeartSurface("back");

  pop();
}

function mousePressed() {
  isDragging = true;

  previousMouseX = mouseX;
  previousMouseY = mouseY;
}

function mouseDragged() {
  let dx = mouseX - previousMouseX;
  let dy = mouseY - previousMouseY;

  rotY += dx * 0.01;
  rotX += dy * 0.01;

  rotX = constrain(rotX, -PI / 2, PI / 2);

  previousMouseX = mouseX;
  previousMouseY = mouseY;

  return false;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(260, 200);
}
