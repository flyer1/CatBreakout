import { Avatar } from './avatar.model';

export class Player {
    totalPoints: number;
    level: number;
    levelPercentComplete: number;
    coins: number;
    speed: number;
    soundEffects: boolean;
    // The list of purchased skins from the store
    avatars: Avatar[];

    activeAvatar?: Avatar;

    static resetPlayer(): Player {
        const result: Player = {
            totalPoints: 0,
            level: 0,
            levelPercentComplete: 0,
            coins: 0,
            speed: 5,
            soundEffects: true,
            avatars: [Avatar.resetAvatar(), { skinKey: 'nyan', isActive: false, accessories: []}]
        };
        result.activeAvatar = result.avatars.find(avatar => avatar.isActive);
        return result;
    }

    static computeLevel(player: Player) {
        const absoluteLevel = 1 + (player.totalPoints / 300);
        player.level = Math.trunc(absoluteLevel);
        player.levelPercentComplete = absoluteLevel % 1 * 100;
    }
}
