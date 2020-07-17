export class Store {
    accessories: Accessory[];
    skins: Skin[];
}

export class Accessory {
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
}

export class ItemCategory {
    static common = 'Common';
    static rare = 'Rare';
    static legendary = 'Legendary';
    static ultraRare = 'Ultra Rare';
}

export class Skin {
    key: string;
    name: string;
    imagePath: string;
    purchased?: boolean;
    confirmPurchase?: boolean;
}