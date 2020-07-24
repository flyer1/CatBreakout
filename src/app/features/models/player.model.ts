import { Avatar } from './avatar.model';

export class Player {
    totalPoints: number;
    level: number;
    levelPercentComplete: number;
    coins: number;
    speed: number;
    soundEffects: boolean;
    avatar: Avatar;

    static resetPlayer(): Player {
        return {
            totalPoints: 0,
            level: 0,
            levelPercentComplete: 0,
            coins: 0,
            speed: 5,
            soundEffects: true,
            avatar: Avatar.resetAvatar()
        }
    }

    static computeLevel(player: Player) {
        const absoluteLevel = 1 + (player.totalPoints / 300);
        player.level = Math.trunc(absoluteLevel);
        player.levelPercentComplete = absoluteLevel % 1 * 100;
    }
}
