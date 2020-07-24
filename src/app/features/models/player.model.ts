import { Avatar } from './avatar.model';

export class Player {
    totalPoints: number;
    level: number
    coins: number;
    speed: number;
    soundEffects: boolean;
    avatar: Avatar;

    static resetPlayer(): Player {
        return {
            totalPoints: 0,
            level: 0,
            coins: 0,
            speed: 5,
            soundEffects: true,
            avatar: Avatar.resetAvatar()
        }
    }
}
