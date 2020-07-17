import { StoreItem } from '../models/store.model';

export class Avatar {
    skin: string;
    accessories: StoreItem[];

    static resetAvatar(): Avatar {
        return {
            skin: '../../../assets/images/avatar/skins/default.png',
            accessories: []
        };
    }
}
