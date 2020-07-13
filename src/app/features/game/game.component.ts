import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  // TODO: change to constants
  paddleHeight = 20;
  paddleWidth = 175;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;
  brickRowCount = 12; // TODO: why is this not called col count?

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: HTMLImageElement;
  numberOfRows: HTMLElement;
  ballRadius = 34;
  x: number;
  y: number;
  dx = 7;
  dy = -7;
  paddleX: number;
  rightPressed: boolean;
  leftPressed: boolean;
  brickColumnCount: number;
  score = 0;
  lives = 600;
  rainbow = ['#80F31F', '#A5DE0B', '#C7C101', '#E39E03', '#F6780F', '#FE5326', '#FB3244', '#ED1868', '#D5078E', '#B601B3', '#9106D3', '#6B16EC', '#472FFA', '#2850FE', '#1175F7', '#039BE5', '#01BECA', '#0ADCA8'];

  //////////////////////////////////////////////////////////////////
  constructor() {}

  ngOnInit(): void {
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ball  = document.getElementById('catHead') as HTMLImageElement;
    this.numberOfRows = document.getElementById('numberOfRows') as HTMLInputElement;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
    this.brickColumnCount = this.numberOfRows.value;
  }

  play() {
    this.initGame();
    var bricks = [];
    for (var c = 0; c < this.brickColumnCount; c++) {
      bricks[c] = [];
      for (var r = 0; r < this.brickRowCount; r++) {
        bricks[c][r] = {
          x: 0,
          y: 0,
          status: 1
        };
      }
    }

    document.addEventListener('keydown', this.keyDownHandler, false);
    document.addEventListener('keyup', this.keyUpHandler, false);
    document.addEventListener('mousemove', this.mouseMoveHandler, false);

    this.draw();
  }

  initGame() {
    document.documentElement.classList.remove('winner');
  }

  let playButton = document.getElementById('playButton');
  playButton.addEventListener('click', this.play, false);


  keyDownHandler(e) {
    if (e.keyCode == 39) {
      this.rightPressed = true;
    } else if (e.keyCode == 37) {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.keyCode == 39) {
      this.rightPressed = false;
    } else if (e.keyCode == 37) {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    var relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddleX = relativeX - this.paddleWidth / 2;
    }
  }

  collisionDetection() {
    for (var c = 0; c < this.brickColumnCount; c++) {
      for (var r = 0; r < this.brickRowCount; r++) {
        var b = this.bricks[c][r];
        if (b.status == 1) {
          if (x > b.x && x < b.x + this.brickWidth && y > b.y && y < b.y + this.brickHeight) {
            dy = -dy;
            b.status = 0;
            this.score++;

            var audio = new Audio('catMeow.mp3');
            audio.play();
            audio = null;

            if (this.score == this.brickRowCount * this.brickColumnCount) {
              document.documentElement.classList.add('winner');
              var video = document.getElementById('catCelebration');
              video.play();
              // alert('YOU WIN, CONGRATS!');
              // document.location.reload();
            }
          }
        }
      }
    }
  }

  drawBall() {
    this.ctx.drawImage(this.ball, 0, 0, 437, 516, x, y, 60, 60);
    return;
  }

  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    this.ctx.fillStyle = '#ff718a';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawBricks() {
    var rainbowIndex = 0;
    for (var c = 0; c < this.brickColumnCount; c++) {
      for (var r = 0; r < this.brickRowCount; r++) {
        if (this.bricks[c][r].status == 1) {
          var brickX = (r * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
          var brickY = (c * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);

          rainbowIndex++;
          if (rainbowIndex >= this.rainbow.length) {
            rainbowIndex = 0;
          }
          this.ctx.fillStyle = this.rainbow[rainbowIndex];

          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }

  drawScore() {
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fillText('Score: ' + this.score, 8, 20);
  }

  drawLives() {
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fillText('Lives: ' + this.lives, this.canvas.width - 80, 20);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.drawLives();
    this.collisionDetection();

    if (x + dx > this.canvas.width - this.ballRadius || x + dx < this.ballRadius) {
      dx = -dx;
    }
    if (y + dy < this.ballRadius) {
      dy = -dy;
    } else if (y + dy > this.canvas.height - this.ballRadius) {
      if (x > paddleX && x < paddleX + this.paddleWidth) {
        dy = -dy;
      } else {
        this.lives--;
        if (!this.lives) {
          // alert('GAME OVER');
          // document.location.reload();
          return;
        } else {
          x = this.canvas.width / 2;
          y = this.canvas.height - 30;
          dx = 5;
          dy = -5;
          this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
        }
      }
    }

    if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(this.draw);
  }
}
