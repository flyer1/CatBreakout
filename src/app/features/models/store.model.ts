export class Store {
    inventory: StoreItem[];
    skins: Skin[];
}

export class StoreItem {
    category: ItemCategory;
    imagePath: string;
    imageWidth?: number
    price: number;
    name: string;
    purchased?: boolean;
    confirmPurchase?: boolean;
}

export class ItemCategory {
    static common = 'Common';
    static rare = 'Rare';
    static legendary = 'Legendary';
    static ultraRare = 'Ultra Rare';
}

export class Skin {
    name: string;
    imagePath: string;
    purchased?: boolean;
    confirmPurchase?: boolean;
}