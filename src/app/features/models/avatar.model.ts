import { Accessory } from '../models/store.model';

export class Avatar {
    skin: string;
    accessories: AvatarAccessory[];

    static resetAvatar(): Avatar {
        return {
            skin: '../../../assets/images/avatar/skins/default.png',
            accessories: []
        };
    }
}

export class AvatarAccessory {
    key: string;
    isActive: boolean;
}