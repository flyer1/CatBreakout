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

/** 
 * This is a watered down representation of the avatar b/c we store this in long term storage in the browser.
 * Therefore we only store a key and indicator if the accessory it active (shown on the avatar).
 * We want to make sure that the information from the store is the only place that contains all of the details about each accessory.
 */
export class AvatarAccessory {
    key: string;
    isActive: boolean;
}