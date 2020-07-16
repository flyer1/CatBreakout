export class Game {

    score: number;
    livesArray: number[];
    isActive: boolean;
    isWinner: boolean;

    /////////
    set lives(value: number) {
        this._lives = value;
        this.livesArray = value ? Array.from(Array(value).keys()).map(value => value) : [];
    };
    get lives(): number {
        return this._lives;
    }
    private _lives: number;

    ///////////////////////////////////////////////////////
    constructor() {
        this.initGame();
    }

    initGame() {
        this.score = 0;
        this.lives = 1;
        this.isActive = false;
        this.isWinner = null;
    }

    wonGame() {
        this.isWinner = true;
        this.isActive = false;
    }

    died() {
        this.lives--;

        if (!this.lives) {
            this.lostGame();
        }
    }

    lostGame() {
        this.isWinner = false;
        this.isActive = false;
    }

    gameOn() {
        this.isActive = true;
    }
}