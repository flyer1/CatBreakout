import { Avatar } from './avatar.model';

export class Player {
    totalPoints: number;
    level: number
    coins: number;
    avatar: Avatar;

    static resetPlayer(): Player {
        return {
            totalPoints: 0,
            level: 0,
            coins: 0,
            avatar: Avatar.resetAvatar()
        }
    }
}
