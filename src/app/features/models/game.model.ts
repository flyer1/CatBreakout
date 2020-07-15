export class Game {
    score: number;

    set lives(value: number) {
        this._lives = value;
        this.livesArray = Array.from(Array(value).keys()).map(value => value);
    };
    get lives(): number {
        return this._lives;
    }
    private _lives: number;

    livesArray: number[];

    ///////////////////////////////////////////////////////
    constructor(data: any) {
        this.score = data.score;
        this.lives = data.lives;
    }
}