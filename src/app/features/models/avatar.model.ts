import { Accessory } from '../models/store.model';

export class Avatar {
    skin: string;
    accessories: string[];

    static resetAvatar(): Avatar {
        return {
            skin: '../../../assets/images/avatar/skins/default.png',
            accessories: []
        };
    }
}
