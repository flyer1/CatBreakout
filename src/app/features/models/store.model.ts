export class Store {
    inventory: StoreItem[];
}

export class StoreItem {
    category: ItemCategory;
    asset: string;
    price: number;
    name: string;
    purchased?: boolean;
}

declare type ItemCategory = 'common' | 'rare' | 'legendary' | 'ultraRare';
