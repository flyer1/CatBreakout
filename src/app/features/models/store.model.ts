export class Store {
    accessories: Accessory[];
    skins: Skin[];

    constructor(data: Store) {
        Object.assign(this, data);
    }

}

export interface Accessory {
    key: string;
    category: ItemCategory;
    image: {
        imagePath: string;
        avatarTop: number;
        avatarLeft: number;
        avatarWidth: number;
        ballTop: number;
        ballLeft: number;
        ballWidth: number;
        ballHeight: number;
        rawWidth: number;
        rawHeight: number;
    },
    price: number;
    name: string;
    purchased?: boolean;
    confirmPurchase?: boolean;
    isActive?: boolean;
    domElement?: HTMLImageElement;
}

export class ItemCategory {
    static common = 'Common';
    static rare = 'Rare';
    static legendary = 'Legendary';
    static ultraRare = 'Ultra Rare';
}

export interface Skin {
    key: string;
    name: string;
    imagePath: string;
    rawWidth: number;
    rawHeight: number;
    purchased?: boolean;
    confirmPurchase?: boolean;
}