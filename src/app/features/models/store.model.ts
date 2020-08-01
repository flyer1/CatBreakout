export class Store {
    skins: Skin[];

    /** The player's purchased are checked to see which skin is active. Makes for easier data binding */
    activeSkin?: Skin;

    constructor(data: Skin[]) {
        this.skins = [];
        data.forEach(item => this.skins.push(item));
    }
}

export interface Skin {
    key: string;
    name: string;
    imagePath: string;
    avatarTop: number;
    rawWidth: number;
    rawHeight: number;
    purchased?: boolean;
    confirmPurchase?: boolean;
    accessories: Accessory[];
}

export interface Accessory {
    key: string;
    category: ItemCategory;
    price: number;
    name: string;
    image: AccessoryImage;

    isActive?: boolean;
    isPurchased?: boolean;
    confirmPurchase?: boolean;
    domElement?: HTMLImageElement;
}

export interface AccessoryImage {
    path: string;
    rawWidth: number;
    rawHeight: number;
    avatarTop: number;
    avatarLeft: number;
    avatarWidth: number;
    ballTop: number;
    ballLeft: number;
    ballWidth: number;
    ballHeight: number;
}

export class ItemCategory {
    static common = 'Common';
    static rare = 'Rare';
    static legendary = 'Legendary';
    static ultraRare = 'Ultra Rare';
}

