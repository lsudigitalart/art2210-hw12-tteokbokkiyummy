let player;
let obstacles = [];
let score = 0;
let lives = 3;
let gameRunning = true;
let maxObstacles = 5;
let startTime;
let catImage, sandalImage, backgroundImage, hurtCat, playImg;
let gameState = "start";
let gameboyFont;
let hurt = 0;

function preload() {
  catImage = loadImage('cat.png');
  sandalImage = loadImage('sandal.png');
  backgroundImage = loadImage('background.png');
  hurtCat = loadImage('hurtCat.png');
  playImg = loadImage('play.png');
  gameboyFont = loadFont('gameboy.ttf'); 
}

function setup() {
  new Canvas(700, 700);
  player = new Sprite(width / 2, height / 2, 30, 30);
  player.addImage(catImage);
  startTime = millis();
  textFont(gameboyFont); 
  frameRate(60);
}

function draw() {
  clear();
  if (gameState === "start") {
    image(playImg, 0, 0, width, height);
    textSize(36);
    fill(255);
    textAlign(CENTER);
    text("Click to Start", width / 2, height - 100);
  } else if (gameState === "play") {
    image(backgroundImage, 0, 0, width, height);
    textSize(24);
    fill(0);
    text("Time: " + score, 300, 30);
    text("Lives: " + lives, 100, 30);

    if (kb.pressing("left")) player.x -= 7;
    if (kb.pressing("right")) player.x += 7;
    if (kb.pressing("up")) player.y -= 7;
    if (kb.pressing("down")) player.y += 7;

    player.x = constrain(player.x, 0, width);
    player.y = constrain(player.y, 0, height);

    let elapsedTime = (millis() - startTime) / 1000;
    maxObstacles = constrain(floor(elapsedTime) / 2 + 5, 5, 60);
    while (obstacles.length < maxObstacles) {
      createObstacle();
    }

    for (let obstacle of obstacles) {
      if (player.overlaps(obstacle)) {
        lives--;
        player.addImage(hurtCat);
        hurt = millis() + 500;
        obstacle.remove();
        obstacles.splice(obstacles.indexOf(obstacle), 1);
        if (lives <= 0) gameOver();
      }
    }

    for (let obstacle of obstacles) {
      obstacle.move();
      if (obstacle.x < -50 || obstacle.x > width + 50 || obstacle.y < -50 || obstacle.y > height + 50) {
        obstacle.remove();
        obstacles.splice(obstacles.indexOf(obstacle), 1);
      }
    }

    if (frameCount % 60 === 0) score++;
    if (millis() > hurt) {
      player.addImage(catImage);
    }

    if (score >= 50) {
      gameRunning = false;
      textSize(36);
      fill(0);
      textAlign(CENTER);
      text("You Win!", width / 2, height / 2);
    }
  } else {
    textSize(36);
    fill(0);
    textAlign(CENTER);
    text("Game Over!", width / 2, height / 2);
    textSize(24);
    text("Time: " + score, width / 2, height / 2 + 50);
  }
}

function createObstacle() {
  let x, y;
  if (random() < 0.5) {
    x = random() < 0.5 ? -50 : width + 50;
    y = random(height);
  } else {
    x = random(width);
    y = random() < 0.5 ? -50 : height + 50;
  }

  let obstacle = new Sprite(x, y, random(20, 50), random(20, 50));
  obstacle.addImage(sandalImage);
  obstacle.speed = random(2, 5);
  obstacle.direction = atan2(player.y - y, player.x - x) * (180 / PI);
  obstacles.push(obstacle);
}

function gameOver() {
  gameState = "gameOver";
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
    startTime = millis();
  }
}
