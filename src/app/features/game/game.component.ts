import { Component, OnInit } from '@angular/core';

import { Game, GameState } from '../models/game.model';
import { Player } from '../models/player.model';
import { PlayerService } from 'src/app/features/services/player.service';
import { StoreService } from '../services/store.service';
import { Store, Accessory, Skin } from '../models/store.model';
import { ThrowStmt } from '@angular/compiler';

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

  BRICK_COL_COUNT = 12; // 12; 

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: HTMLImageElement;
  activeAccessories: Accessory[];
  bricks = [];
  ballRadius = 15;
  x: number;
  y: number;
  dx = 8;
  dy = -15;
  paddleX: number;
  rightPressed: boolean;
  leftPressed: boolean;
  brickRowCount: number;
  game: Game;
  player: Player;
  store: Store;
  skin: Skin;
  rainbow = ['#80F31F', '#A5DE0B', '#C7C101', '#E39E03', '#F6780F', '#FE5326', '#FB3244', '#ED1868', '#D5078E', '#B601B3', '#9106D3', '#6B16EC', '#472FFA', '#2850FE', '#1175F7', '#039BE5', '#01BECA', '#0ADCA8'];
  isInitialized = false;
  coinValueChanged = false;
  GameState = GameState;

  //////////////////////////////////////////////////////////////////
  constructor(private playerService: PlayerService, private storeService: StoreService) { }

  ngOnInit(): void {
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.paddleX = (this.canvas.width - PADDLE_WIDTH) / 2;
    this.brickRowCount = 11;  // 11
    this.player = this.playerService.player;
    this.store = this.storeService.store;

    this.initGame();

    // Use this next line to pause the game during building of inventory
    // this.workshop();
  }

  play() {
    this.ball = document.getElementById('catHead') as HTMLImageElement;
    // TODO: for now just pick the default skin
    this.skin = this.store.skins[0];

    this.activeAccessories = [...this.store.accessories.filter(accessory => accessory.isActive)];
    this.activeAccessories.forEach(accessory => accessory.domElement = document.getElementById('accessory-' + accessory.key) as HTMLImageElement);

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 60;


    this.game.initGame();
    this.game.gameOn();

    // Init data structure for bricks
    for (let c = 0; c < this.brickRowCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.BRICK_COL_COUNT; r++) {
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

    this.game = new Game();

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
    for (let c = 0; c < this.brickRowCount; c++) {
      for (let r = 0; r < this.BRICK_COL_COUNT; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (this.x > b.x && this.x < b.x + BRICK_WIDTH && this.y > b.y && this.y < b.y + BRICK_HEIGHT) {
            this.dy = -this.dy;
            // Block HIT!
            b.status = 0;

            this.game.score++;
            this.player.totalPoints++;

            this.calculateCoins();

            if (this.player.soundEffects) {
              let audio = new Audio('../../../assets/audio/catMeow.mp3');
              audio.play();
              audio = null;
            }

            // WON GAME!
            if (this.game.score === this.BRICK_COL_COUNT * this.brickRowCount) {
              this.game.wonGame();

              const video = document.getElementById('catCelebration') as HTMLVideoElement;
              video.play();
              // We know the video is 11 seconds long. Reset state after it is done.
              // TODO: See if this event can be used instead:
              // v.addEventListener('ended',function() {clearInterval(i);},false);
              setTimeout(_ => this.game.resetGame(), 12000);
            }

            this.playerService.updateStorage();

            return this.game.isWinner;
          }
        }
      }
    }

    return this.game.isWinner;
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
    const aspectRatio = this.skin.rawWidth / this.skin.rawHeight;
    this.ctx.drawImage(this.ball, 0, 0, this.skin.rawWidth, this.skin.rawHeight, this.x, this.y, 60, 60 / aspectRatio);
    this.activeAccessories.forEach(accessory => {
      // Note: Using the same aspect ratio method when drawing to the canvas does not work for image of various sizes.
      this.ctx.drawImage(accessory.domElement, 0, 0, accessory.image.rawWidth, accessory.image.rawHeight, this.x + accessory.image.ballLeft, this.y + accessory.image.ballTop, accessory.image.ballWidth, accessory.image.ballHeight);
    })
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
    for (let c = 0; c < this.brickRowCount; c++) {
      for (let r = 0; r < this.BRICK_COL_COUNT; r++) {
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

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    const gameOver = this.collisionDetection();

    // If they won a round, stop the game until they trigger another round
    if (gameOver) { return; }

    if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy;
    } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
      if (this.x > this.paddleX && this.x < this.paddleX + PADDLE_WIDTH) {
        this.dy = -this.dy;
      } else {
        // The game class will determine if we've lost the game or still have some lives left
        this.game.died();

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 60;
        this.dx = 8;
        this.dy = -15;
        this.paddleX = (this.canvas.width - PADDLE_WIDTH) / 2;
      }
    }

    if (this.rightPressed && this.paddleX < this.canvas.width - PADDLE_WIDTH) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    this.x += this.dx;
    this.y += this.dy;

    if (this.game.isActive) {
      requestAnimationFrame(_ => this.draw());
    }
  }

  toggleSoundEffects() {
    this.player.soundEffects = !this.player.soundEffects;
    this.playerService.updateStorage();
  }

  /** Use this method to pause the game such that you can set the meta-data for the accessories */
  workshop() {
    setTimeout(() => {
      this.play();
      this.y = 500;
      this.game.isActive = false;
    }, 200);
  }
}
