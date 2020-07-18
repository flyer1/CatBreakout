import { Injectable } from '@angular/core';
import { Store, ItemCategory } from '../models/store.model';
import { Player } from '../models/player.model';
import { PlayerService } from 'src/app/features/services/player.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    store: Store;

    constructor(private playerService: PlayerService) { }

    init() {
        this.store = {
            accessories: [
                {
                    key: 'goldenCrown',
                    category: ItemCategory.common,
                    imagePath: '../../../assets/images/avatar/accessories/crown-gold.png',
                    price: 230,
                    name: 'Golden Crown',
                    imageTop: '12px',
                    imageLeft: '42px',
                    imageWidth: '107px'
                },
                {
                    key: 'funnyMask',
                    category: ItemCategory.common,
                    imagePath: '../../../assets/images/avatar/accessories/funny-glasses.png',
                    price: 2340,
                    name: 'Funny Mask',
                    imageTop: '95px',
                    imageLeft: '48px',
                    imageWidth: '100px'
                },
                {
                    key: 'rainbowBow',
                    category: ItemCategory.rare,
                    imagePath: '../../../assets/images/avatar/accessories/hair-bow-rainbow.png',
                    price: 2110,
                    name: 'Rainbow Bow',
                    imageTop: '20px',
                    imageLeft: '90px',
                    imageWidth: '90px',
                },
                {
                    key: 'cuteGlasses',
                    category: ItemCategory.rare,
                    imagePath: '../../../assets/images/avatar/accessories/heart-glasses.png',
                    price: 220,
                    name: 'Cute Glasses',
                    imageTop: '80px',
                    imageLeft: '43px',
                    imageWidth: '110px'
                },
                {
                    key: 'tiaria',
                    category: ItemCategory.ultraRare,
                    imagePath: '../../../assets/images/avatar/accessories/princess-crown.png',
                    price: 420,
                    name: 'Tiaria',
                    imageTop: '0px',
                    imageLeft: '0px',
                },
                {
                    key: 'reallyCuteGlasses',
                    category: ItemCategory.ultraRare,
                    imagePath: '../../../assets/images/avatar/accessories/rainbow-heart-glasses.png',
                    price: 20,
                    name: 'Really Cute Glasses',
                    imageTop: '100px',
                    imageLeft: '43px',
                    imageWidth: '110px'
                },
                {
                    key: 'coolShades',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses.png',
                    price: 20,
                    name: 'Cool Shades',
                    imageTop: '109px',
                    imageLeft: '43px',
                    imageWidth: '110px'
                },
                {
                    key: 'shades',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses-aviator.png',
                    price: 20,
                    name: 'Shades',
                    imageTop: '65px',
                    imageLeft: '42px',
                    imageWidth: '110px'
                },
                {
                    key: 'harryPotterGlasses',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses-swirls.png',
                    price: 20,
                    name: 'Harry Potter Glasses',
                    imageTop: '107px',
                    imageLeft: '42px',
                    imageWidth: '110px'
                },
                {
                    key: 'extremelyCuteUnicornHorn',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/unicorn-horn.png',
                    price: 20,
                    name: 'Extremely Cute Unicorn Horn',
                    imageTop: '-20px',
                    imageLeft: '82px',
                    imageWidth: '35px'
                },
                {
                    key: 'donut',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/donut.png',
                    price: 20,
                    name: 'Donut Pet',
                    imageTop: '133px',
                    imageLeft: '105px',
                    imageWidth: '100px'
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

        this.resolvePurchases(this.playerService.player);
    }

    /** Figure out which items that user has currently purchased */
    resolvePurchases(player: Player) {
        this.store.accessories.forEach(accessory => {
            const found = player.avatar.accessories.find(item => accessory.key === item.key);

            if (found) {
                accessory.purchased = true;
                accessory.isActive = found.isActive;
            } else {
                accessory.purchased = false;
            }
        });
    }
}