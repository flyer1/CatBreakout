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
            level: 1,
            levelPercentComplete: 0,
            coins: 0,
            speed: 5,
            soundEffects: true,
            avatars: [Avatar.resetAvatar()]
        };
        result.activeAvatar = result.avatars.find(avatar => avatar.isActive);
        return result;
    }

    static calculateCoins(player: Player) {
        const pointsPerCoin = 10;
        player.coins = Math.trunc(player.totalPoints / pointsPerCoin);
    }

    static computeLevel(player: Player) {
        const pointsPerLevel = 300;
        const absoluteLevel = 1 + (player.totalPoints / pointsPerLevel);
        player.level = Math.trunc(absoluteLevel);
        player.levelPercentComplete = absoluteLevel % 1 * 100;
    }

    /** Ensure that all the skins are unlocked for the current level */
    static unlockSkin(player: Player) {
        // Check for nyan cat
        Player.checkSkin(player, 5, 'nyan');
        Player.checkSkin(player, 10, 'crookShanks');
        Player.checkSkin(player, 15, 'rainbowCat');
        Player.checkSkin(player, 20, 'ella');
    }

    static checkSkin(player: Player, level: number, key: string) {
        if (player.level >= level) {
            const found = player.avatars.find(avatar => avatar.skinKey === key);

            if (!found) {
                player.avatars.push({ skinKey: key, isActive: false, accessories: [] });
            }
        }
    }
}
