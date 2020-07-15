import { Component, OnInit } from '@angular/core';
import { SessionStorageService, SessionStorageKeys } from '../../core/storage/session-storage.service';

import { Game } from '../models/game.model';
import { Player } from '../models/player.model';

const PADDLE_HEIGHT = 20;
const PADDLE_WIDTH = 175;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  BRICK_ROW_COUNT = 12; // TODO: why is this not called col count?

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: HTMLImageElement;
  bricks = [];
  numberOfRows: HTMLElement;
  ballRadius = 34;
  x: number;
  y: number;
  dx = 10;
  dy = -10;
  paddleX: number;
  rightPressed: boolean;
  leftPressed: boolean;
  brickColumnCount: number;
  game: Game;
  player: Player;
  rainbow = ['#80F31F', '#A5DE0B', '#C7C101', '#E39E03', '#F6780F', '#FE5326', '#FB3244', '#ED1868', '#D5078E', '#B601B3', '#9106D3', '#6B16EC', '#472FFA', '#2850FE', '#1175F7', '#039BE5', '#01BECA', '#0ADCA8'];
  isInitialized = false;
  isWinner = false;
  coinValueChanged = false;

  //////////////////////////////////////////////////////////////////
  constructor(private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.ball = document.getElementById('catHead') as HTMLImageElement;
    this.numberOfRows = document.getElementById('numberOfRows') as HTMLInputElement;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.paddleX = (this.canvas.width - PADDLE_WIDTH) / 2;
    this.brickColumnCount = 10;

    this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
  }

  play() {
    this.initGame();

    // Init data structure for bricks
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.BRICK_ROW_COUNT; r++) {
        this.bricks[c][r] = {
          x: 0,
          y: 0,
          status: 1
        };
      }
    }

    this.draw();
  }

  initGame() {
    this.isWinner = false;
    this.game = new Game({ score: 0, lives: 9 });

    if (!this.isInitialized) {
      document.addEventListener('keydown', (e) => this.keyDownHandler(e), false);
      document.addEventListener('keyup', (e) => this.keyUpHandler(e), false);
      document.addEventListener('mousemove', (e) => this.mouseMoveHandler(e), false);
    }
  }

  // #region EVENT HANDLERS
  keyDownHandler(e) {
    if (e.keyCode === 39) {
      this.rightPressed = true;
    } else if (e.keyCode === 37) {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.keyCode === 39) {
      this.rightPressed = false;
    } else if (e.keyCode === 37) {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddleX = relativeX - PADDLE_WIDTH / 2;
    }
  }

  // #endregion

  collisionDetection() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.BRICK_ROW_COUNT; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (this.x > b.x && this.x < b.x + BRICK_WIDTH && this.y > b.y && this.y < b.y + BRICK_HEIGHT) {
            this.dy = -this.dy;
            b.status = 0;
            this.game.score++;
            this.player.totalPoints++;
            this.calculateCoins();

            // let audio = new Audio('../../../assets/audio/catMeow.mp3');
            // audio.play();
            // audio = null;

            if (this.game.score === this.BRICK_ROW_COUNT * this.brickColumnCount) {
              this.isWinner = true;
              const video = document.getElementById('catCelebration') as HTMLVideoElement;
              video.play();

              // alert('YOU WIN, CONGRATS!');
              // document.location.reload();
            }

            this.sessionStorageService.set(SessionStorageKeys.PLAYER_STATE, this.player);
          }
        }
      }
    }
  }

  calculateCoins() {
    const previousValue = this.player.coins;
    this.player.coins = Math.trunc(this.player.totalPoints / 10);

    if (previousValue === this.player.coins) { return; }

    // This flag triggers a ta-da animation which draws attention to the fact that the user gained a coin.
    this.coinValueChanged = true;

    setTimeout(_ => this.coinValueChanged = false, 1200);
  }

  drawBall() {
    this.ctx.drawImage(this.ball, 0, 0, 437, 516, this.x, this.y, 60, 60);
    return;
  }

  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    this.ctx.fillStyle = '#ff718a';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawBricks() {
    let rainbowIndex = 0;
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.BRICK_ROW_COUNT; r++) {
        if (this.bricks[c][r].status === 1) {
          const brickX = (r * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
          const brickY = (c * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);

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
    this.ctx.font = '16px Helvetica';
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fillText('Score: ' + this.game.score, 8, 20);
  }

  drawLives() {
    this.ctx.font = '16px Helvetica';
    this.ctx.fillStyle = '#0095DD';
    // this.ctx.fillText('Lives: ' + this.game.lives, this.canvas.width - 80, 20);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.drawLives();
    this.collisionDetection();

    if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy;
    } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
      if (this.x > this.paddleX && this.x < this.paddleX + PADDLE_WIDTH) {
        this.dy = -this.dy;
      } else {
        this.game.lives--;
        if (!this.game.lives) {
          // alert('GAME OVER');
          // document.location.reload();
          return;
        } else {
          this.x = this.canvas.width / 2;
          this.y = this.canvas.height - 30;
          this.dx = 5;
          this.dy = -5;
          this.paddleX = (this.canvas.width - PADDLE_WIDTH) / 2;
        }
      }
    }

    if (this.rightPressed && this.paddleX < this.canvas.width - PADDLE_WIDTH) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    this.x += this.dx;
    this.y += this.dy;

    requestAnimationFrame(_ => this.draw());
  }
}
