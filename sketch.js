let ball;
let rightPaddle;
let leftPaddle;

let gameEnded = false;

let LPoints = 0;
let RPoints = 0;
                                                                                        
//////////////////////
// GAME SETTINGS 
////////////////////
let game = {
  width: 600,
  height: 600,
  scoreToWin: 5
};

let ballSettings = {
  radius: 20,
  velocityX: 5, //default velocity on x axis
  velocityY: 5 //default velocity on y axis
}

let rightPaddleSettings = {
  width: 20,
  height: 100,
  maxVelocity: 10
}

let leftPaddleSettings = {
  width: 20,
  height: 100,
  maxVelocity: 10
}


//////////////////////
// MAIN FUNCTIONS
////////////////////
function setup() {
  createCanvas(game.width, game.height);

  ball = new Ball();
    ball.x = game.width / 2;
    ball.y = game.height / 2;
    ball.radius = ballSettings.radius;
  
  rightPaddle = new Paddle();
    rightPaddle.x = game.width - 40;
    rightPaddle.y = game.height / 2 - 50;
    rightPaddle.width = rightPaddleSettings.width;
    rightPaddle.height = rightPaddleSettings.height;
    rightPaddle.maxVelocity = rightPaddleSettings.maxVelocity;

  leftPaddle = new Paddle();
    leftPaddle.x = 20;
    leftPaddle.y = game.height / 2 - 50;
    leftPaddle.width = leftPaddleSettings.width;
    leftPaddle.height = leftPaddleSettings.height;
    leftPaddle.maxVelocity = leftPaddleSettings.maxVelocity;
}

function draw() {
  background(220);

  drawPaddle(rightPaddle);
  drawPaddle(leftPaddle);
  drawBall(ball);

  if (gameEnded) {
    chceckScore();
    return;
  }

  updatePaddle(rightPaddle, mouseY);
  updatePaddle(leftPaddle, ball.y);
  updateBall(ball);

  drawScore(100);
}


//////////////////////
// PADDLE SECTION
////////////////////
class Paddle {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.maxVelocity = 10;
  }
}

function drawPaddle(paddle) {
  rect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function updatePaddle(paddle, targetY) {
  //move paddle towards targetY
  var distance = targetY - (paddle.y + paddle.height / 2);
  if (distance < 0) {
    distance = max(distance, -paddle.maxVelocity);
  }
  if (distance > 0) {
    distance = min(distance, paddle.maxVelocity);
  }
  paddle.y += distance;

  //keep paddle on screen
  paddle.y = max(paddle.y, 0);
  paddle.y = min(paddle.y, game.height - paddle.height);
}

function resetPaddles() {
  rightPaddle.y = game.height / 2 - 50;
  leftPaddle.y = game.height / 2 - 50;
}


//////////////////////
// BALL SECTION
////////////////////
class Ball {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 20;
    this.velocityX = 5;
    this.velocityY = 5;
  }
}

function drawBall(ball) {
  circle(ball.x, ball.y, ball.radius);
}

function updateBall(ball) {
  //move ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  edgesCollisionBall(ball);

  paddlesCollisionBall(ball);
}

function resetBall() {
  //reset ball position
  ball.x = game.width / 2;
  ball.y = game.height / 2;

  //reset ball velocity
  ball.velocityX = random([ballSettings.velocityX, -ballSettings.velocityX])
  ball.velocityY = random([ballSettings.velocityY, -ballSettings.velocityY])
}

function edgesCollisionBall(ball) {
  //ball - bounce off top and bottom edges
  if (ball.y < 0 || ball.y > game.height) {
    ball.velocityY *= -1;
  }
  
  //ball - reset from hitting left and right edges
  if (ball.x < 0 || ball.x > game.width) {
    updateScore();

    resetBall();
    resetPaddles();

    wait(1000);
  }
}

function paddlesCollisionBall(ball) {
  //ball - bounce off paddles
  if (checkCollision(ball, rightPaddle)) {
    if (ball.velocityX > 0) {
      ball.velocityX *= -1;
    }
  } else if (checkCollision(ball, leftPaddle)) {
    if (ball.velocityX < 0) {
      ball.velocityX *= -1;
    }
  }
}


//////////////////////
// SCORE SECTION
////////////////////
function drawScore(distanceFromEdge) {
  textSize(50);

  text(LPoints, 0 + distanceFromEdge, 100);
  text(RPoints, game.width - textWidth(RPoints) - distanceFromEdge, 100);
}

function updateScore() {
  //check if ball hit left or right edge
  if (ball.x < 0) {
    RPoints++;
  } else if (ball.x > game.width) {
    LPoints++;
  }

  chceckScore();
}


//////////////////////
// HELPER FUNCTIONS
////////////////////
function checkCollision(ball, paddle) {
  //check if ball is within paddle
  if (ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {
    if (ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height) {
      return true;
    }
  }
}

function chceckScore() {
  if (LPoints == game.scoreToWin) {
    text("Left Player Wins!", game.width / 2 - textWidth("Left Player Wins!") / 2, game.height / 2);
    gameEnded = true;
  } else if (RPoints == game.scoreToWin) {
    text("Right Player Wins!", game.width / 2 - textWidth("Right Player Wins!") / 2, game.height / 2);
    gameEnded = true;
  }
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}