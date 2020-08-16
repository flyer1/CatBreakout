import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { takeUntil, skip } from 'rxjs/operators';

import { Game, GameState } from '../models/game.model';
import { Player } from '../models/player.model';
import { PlayerService } from 'src/app/cat-breakout/services/player.service';
import { StoreService } from '../services/store.service';
import { Store, Accessory, Skin } from '../models/store.model';
import { ViewportService, ShellResizedInfo } from '../../core/browser/viewport.service';
import { ComponentBase } from '../../core/infrastructure/component-base';

const PADDLE_HEIGHT = 20;
const PADDLE_WIDTH = 175;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;
const GAME_HEADER_HEIGHT = 300;

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent extends ComponentBase implements OnInit, AfterViewInit, OnDestroy {

  BRICK_COL_COUNT = 12;
  debugCounter = 0;

  // HTML references
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: HTMLImageElement;
  video: HTMLVideoElement;

  activeAccessories: Accessory[];
  bricks = [];
  ballRadius = 15;
  x: number;
  y: number;
  dx = 5;
  dy = -7;
  speedHorizontal = 5;
  speedVertical = -7;
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
  playVideoOnTouchEnd: boolean;

  //////////////////////////////////////////////////////////////////

  @ViewChild('gameSurface', { static: false }) gameSurface: ElementRef<HTMLDivElement>;
  @ViewChild('gameCanvas', { static: false }) gameCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('winnerVideo', { static: false }) winnerVideo: ElementRef<HTMLVideoElement>;

  //////////////////////////////////////////////////////////////////
  constructor(private el: ElementRef, private viewportService: ViewportService, private playerService: PlayerService,
    private storeService: StoreService, private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.brickRowCount = 9;
    this.player = this.playerService.player;
    this.store = this.storeService.store;

    this.game = new Game();

    this.canvas = document.getElementById('my-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.paddleX = (this.canvas.width - PADDLE_WIDTH) / 2;

    this.video = document.getElementById('catCelebration') as HTMLVideoElement;

    console.log(this.video);

    // Use this next line to pause the game during building of inventory
    // this.workshop();
  }

  ngAfterViewInit() {
    this.viewportService.shellResized$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(e => {
        this.resizeCanvas(e);
      });

  }

  play() {
    this.initGame();

    this.ball = document.getElementById('catHead') as HTMLImageElement;
    this.skin = this.store.activeSkin;

    this.activeAccessories = [...this.skin.accessories.filter(accessory => accessory.isActive)];
    this.activeAccessories.forEach(accessory => accessory.domElement = document.getElementById('accessory-' + accessory.key) as HTMLImageElement);

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 60;

    this.game.initGame();
    this.game.gameOn();

    this.BRICK_COL_COUNT = Math.floor(this.viewportService.getViewportW() / 92);

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

  /** Be responsive in the size of the canvas */
  resizeCanvas(resizeInfo: ShellResizedInfo) {
    const width = Math.min(1130, resizeInfo.viewportWidth - 65);
    this.renderer.setAttribute(this.gameCanvas.nativeElement, 'width', width + '');
    this.renderer.setAttribute(this.winnerVideo.nativeElement, 'width', width + '');

    this.renderer.setAttribute(this.gameCanvas.nativeElement, 'height', resizeInfo.viewportHeight - GAME_HEADER_HEIGHT + '');
    this.renderer.setAttribute(this.winnerVideo.nativeElement, 'height', resizeInfo.viewportHeight - GAME_HEADER_HEIGHT + '');

  }

  initGame() {
    this.dy = this.calculateDy();

    if (!this.isInitialized) {
      this.canvas.addEventListener('mousemove', this.moveHandler.bind(this), false);
      this.canvas.addEventListener('touchmove', this.moveHandler.bind(this), false);
      this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);

      // The end of the celebration video resets the game for another round
      this.video.addEventListener('ended', this.onVideoEnded.bind(this), false);

      this.isInitialized = true;
    }
  }

  // #region EVENT HANDLERS
  moveHandler(e) {
    const offsetX = e.touches && e.touches.length ? e.touches[0].clientX - this.el.nativeElement.firstChild.offsetLeft : e.offsetX;
    this.paddleX = offsetX - PADDLE_WIDTH / 2;
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

            this.checkForWinner();

            this.playerService.updateStorage();

            return this.game.isWinner;
          }
        }
      }
    }

    return this.game.isWinner;
  }

  checkForWinner() {
    this.debugCounter++;

    if (this.debugCounter < 3 && this.game.score !== this.BRICK_COL_COUNT * this.brickRowCount) {
      return;
    }

    this.game.wonGame();

    this.video.muted = false;
    
    // iOS/Safari have implemented stricter measures when it comes to playing vidoes. If the video failed to play, this is the likely cause.
    // enable the flag that plays the video after the user end
    this.video.play().catch(e => {
      console.warn('Unable to play video on this device. Waiting for touchEnd event in order to try again');
      this.playVideoOnTouchEnd = true
    });
  }

  calculateCoins() {
    const previousValue = this.player.coins;
    Player.calculateCoins(this.player);

    if (previousValue === this.player.coins) { return; }

    // This flag triggers a ta-da animation which draws attention to the fact that the user gained a coin.
    this.coinValueChanged = true;

    setTimeout(_ => this.coinValueChanged = false, 1200);
  }

  drawBall() {
    this.ctx.drawImage(this.ball, 0, 0, this.skin.rawWidth, this.skin.rawHeight, this.x, this.y, this.skin.ballWidth, this.skin.ballHeight);
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
        this.dx = this.speedHorizontal;
        this.dy = this.calculateDy();
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

  onSpeedChanged($event) {
    this.player.speed = +$event.target.value;
    this.dy = this.calculateDy();
    this.playerService.updateStorage();
  }

  /** After the celebration video has played, reset the game */
  onVideoEnded() {
    this.game.resetGame();
  }

  /**
   * iOS is very restrictive about when videos are allowed to be played from code. Only certain events are allowed to call video.play().
   * Since our game can be won via a touchmove event, this means that the video will not play.
   * Therefore we wait until the user has lifted their finger after clearing the board before playing the video.
   * 
   * It's explained in a blog post from here: https://webkit.org/blog/6784/new-video-policies-for-ios/
   * The main bit is:
   * “A note about the user gesture requirement: when we say that an action must have happened “as a result of a user gesture”, we mean that the JavaScript which resulted in the 
   * call to video.play(), for example, must have directly resulted from a handler for a touchend, click, doubleclick, or keydown event. So, 
   *    button.addEventListener('click', () => { video.play(); }) 
   * would satisfy the user gesture requirement. 
   *    video.addEventListener('canplaythrough', () => { video.play(); }) would not.”
  */
  onTouchEnd() {
    if (this.playVideoOnTouchEnd) {
      this.video.play();
      this.playVideoOnTouchEnd = false;
    }
  }

  calculateDy() {
    return this.speedVertical - this.player.speed;
  }

  /** Use this method to pause the game such that you can set the meta-data for the accessories */
  workshop() {
    setTimeout(() => {
      this.play();
      this.y = 500;
      this.game.isActive = false;
    }, 200);
  }

  ngOnDestroy() {
    this.canvas.removeEventListener('mousemove', this.moveHandler.bind(this), false);
    this.canvas.removeEventListener('touchmove', this.moveHandler.bind(this), false);
    this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this), false);
    this.video.removeEventListener('ended', this.onVideoEnded.bind(this), false);
    this.video = null;
  }
}
