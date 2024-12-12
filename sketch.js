let player;
let obstacles = [];
let score = 0;
let lives = 3;
let gameRunning = true;
let maxObstacles = 5; 
let startTime;
let catImage;
let sandalImage;

function preload() {
  catImage = loadImage('cat.png');
  sandalImage = loadImage('sandal.png'); 
}

function setup() {
  new Canvas(700, 700); 

  player = new Sprite(width / 2, height / 2, 30, 30); 
  player.addImage(catImage); 

  startTime = millis();
}

function draw() {
  clear();

  if (gameRunning) {

    textSize(24);
    fill(0);
    text("Time: " + score, 200, 30);
    text("Lives: " + lives, 50, 30);

    // move player
    if (kb.pressing("left")) player.x -= 7; 
    if (kb.pressing("right")) player.x += 7;
    if (kb.pressing("up")) player.y -= 7;
    if (kb.pressing("down")) player.y += 7;

    // canvas boundaries 
    player.x = constrain(player.x, 0, width);
    player.y = constrain(player.y, 0, height);

    let elapsedTime = (millis() - startTime) / 1000; 
    maxObstacles = constrain(floor(elapsedTime) / 2 + 5, 5, 60);
    while (obstacles.length < maxObstacles) {
      createObstacle();
    }

    // obstacle colleision
    for (let obstacle of obstacles) {
      if (player.overlaps(obstacle)) {
        lives--;
        obstacle.remove();
        obstacles.splice(obstacles.indexOf(obstacle), 1);

        if (lives <= 0) {
          gameOver();
        }
      }
    }

    // Move obstacles
    for (let obstacle of obstacles) {
      obstacle.move();

      if (obstacle.x < -50 || obstacle.x > width + 50 || obstacle.y < -50 || obstacle.y > height + 50) {
        obstacle.remove();
        obstacles.splice(obstacles.indexOf(obstacle), 1);
      }
    }

    if (frameCount % 60 === 0) {
      score++;
    }

    if (score >= 50) {
      gameRunning = false;
      textSize(36);
      fill(0);
      textAlign(CENTER);
      text("You Win!", 300, 300);
      textSize(24);
    }
  } else {
    textSize(36);
    fill(0);
    textAlign(CENTER);
    text("Game Over!", 300, 300);
    textSize(24);
    text("Final Score: " + score, 300, 35050);
  }
}

function createObstacle() {
  let x, y;

  // Spawn obstacles
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
  gameRunning = false;
}
