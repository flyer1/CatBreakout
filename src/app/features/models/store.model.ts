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
    imagePath: string;
    imageTop: string;
    imageLeft: string;
    imageWidth?: string;
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
    purchased?: boolean;
    confirmPurchase?: boolean;
}