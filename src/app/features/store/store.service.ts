import { Injectable } from '@angular/core';
import { Store, ItemCategory } from '../models/store.model';
import { Player } from '../models/player.model';
import { AvatarService } from 'src/app/shared/avatar/avatar.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    store: Store;

    constructor(private avatarService: AvatarService) { }

    init() {
        this.store = {
            accessories: [
                {
                    key: 'goldenCrown',
                    category: ItemCategory.common,
                    imagePath: '../../../assets/images/avatar/accessories/crown-gold.png',
                    price: 20,
                    name: 'Golden Crown'
                },
                {
                    key: 'funnyMask',
                    category: ItemCategory.common,
                    imagePath: '../../../assets/images/avatar/accessories/funny-glasses.png',
                    price: 20,
                    name: 'Funny Mask'
                },
                {
                    key: 'rainbowBow',
                    category: ItemCategory.rare,
                    imagePath: '../../../assets/images/avatar/accessories/hair-bow-rainbow.png',
                    price: 20,
                    name: 'Rainbow Bow'
                },
                {
                    key: 'cuteGlasses',
                    category: ItemCategory.rare,
                    imagePath: '../../../assets/images/avatar/accessories/heart-glasses.png',
                    price: 20,
                    name: 'Cute Glasses'
                },
                {
                    key: 'tiaria',
                    category: ItemCategory.ultraRare,
                    imagePath: '../../../assets/images/avatar/accessories/princess-crown.png',
                    price: 20,
                    name: 'Tiaria'
                },
                {
                    key: 'reallyCuteGlasses',
                    category: ItemCategory.ultraRare,
                    imagePath: '../../../assets/images/avatar/accessories/rainbow-heart-glasses.png',
                    price: 20,
                    name: 'Really Cute Glasses'
                },
                {
                    key: 'coolShades',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses.png',
                    price: 20,
                    name: 'Cool Shades'
                },
                {
                    key: 'shades',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses-aviator.png',
                    price: 20,
                    name: 'Shades'
                },
                {
                    key: 'harryPotterGlasses',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses-swirls.png',
                    price: 20,
                    name: 'Harry Potter Glasses'
                },
                {
                    key: 'extremelyCuteUnicornHorn',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/unicorn-horn.png',
                    price: 20,
                    name: 'Extremely Cute Unicorn Horn',
                    imageWidth: 35
                },
            ],
            skins: [
                {
                    key: 'default',
                    name: 'default',
                    imagePath: '../../../assets/images/avatar/skins/default.png',
                },
                {
                    key: 'nyanCat',
                    name: 'Nyan Cat',
                    imagePath: '../../../assets/images/avatar/skins/nyan-cat.gif',
                },
            ]
        };

        this.resolvePurchases(this.avatarService.player);
    }

    /** Figure out which items that user has currently purchased */
    resolvePurchases(player: Player) {
        this.store.accessories.forEach(item => item.purchased = player.avatar.accessories.indexOf(item.key) >= 0);
    }
}
