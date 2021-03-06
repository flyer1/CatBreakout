export class Game {

    score: number;
    livesArray: number[];
    isActive: boolean;
    isWinner: boolean;
    state: GameState;

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
        this.lives = 9;
        this.isActive = false;
        this.isWinner = null;
        this.state = GameState.NewGame;
    }

    /* After winning a game, reset for another round */
    resetGame() {
        this.state = GameState.PlayAgain;
    }

    wonGame() {
        this.isWinner = true;
        this.isActive = false;
        this.state = GameState.GameReward;
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
        this.state = GameState.LostGame;
    }

    gameOn() {
        this.isActive = true;
    }
}

export enum GameState {
    NewGame = 0,
    LostGame = 1,
    GameReward = 2,
    PlayAgain = 3
}
