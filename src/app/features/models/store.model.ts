export class Store {
    inventory: StoreItem[];
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
    static ultraRare = 'UltraRare';
}

// declare type ItemCategory = 'common' | 'rare' | 'legendary' | 'ultraRare';
// export enum ItemCategory2 {
//     Common = 0,
//     Rare = 1,
//     Legendary = 2,
//     UltraRare = 3
// }