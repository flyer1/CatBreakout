import { Injectable } from '@angular/core';
import { Store, ItemCategory } from '../models/store.model';
import { Player } from '../models/player.model';
import { PlayerService } from 'src/app/features/services/player.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    store: Store;

    constructor(private playerService: PlayerService) { }

    init() {
        this.store = new Store({
            accessories: [
                {
                    key: 'goldenCrown',
                    category: ItemCategory.common,
                    imagePath: '../../../assets/images/avatar/accessories/crown-gold.png',
                    price: 230,
                    name: 'Golden Crown',
                    imageTop: '2px',
                    imageLeft: '22px',
                    imageWidth: '107px',
                    rawWidth: 590,
                    rawHeight: 352
                },
                {
                    key: 'funnyMask',
                    category: ItemCategory.common,
                    imagePath: '../../../assets/images/avatar/accessories/funny-glasses.png',
                    price: 2340,
                    name: 'Funny Mask',
                    imageTop: '85px',
                    imageLeft: '28px',
                    imageWidth: '100px',
                    rawWidth: 250,
                    rawHeight: 188
                },
                {
                    key: 'rainbowBow',
                    category: ItemCategory.rare,
                    imagePath: '../../../assets/images/avatar/accessories/hair-bow-rainbow.png',
                    price: 2110,
                    name: 'Rainbow Bow',
                    imageTop: '10px',
                    imageLeft: '70px',
                    imageWidth: '90px',
                    rawWidth: 911,
                    rawHeight: 713
                },
                {
                    key: 'cuteGlasses',
                    category: ItemCategory.rare,
                    imagePath: '../../../assets/images/avatar/accessories/heart-glasses.png',
                    price: 220,
                    name: 'Cute Glasses',
                    imageTop: '90px',
                    imageLeft: '23px',
                    imageWidth: '110px',
                    rawWidth: 238,
                    rawHeight: 102
                },
                {
                    key: 'tiaria',
                    category: ItemCategory.ultraRare,
                    imagePath: '../../../assets/images/avatar/accessories/princess-crown.png',
                    price: 420,
                    name: 'Tiaria',
                    imageTop: '0px',
                    imageLeft: '0px',
                    rawWidth: 457,
                    rawHeight: 246
                },
                {
                    key: 'reallyCuteGlasses',
                    category: ItemCategory.ultraRare,
                    imagePath: '../../../assets/images/avatar/accessories/rainbow-heart-glasses.png',
                    price: 20,
                    name: 'Really Cute Glasses',
                    imageTop: '90px',
                    imageLeft: '23px',
                    imageWidth: '110px',
                    rawWidth: 1395,
                    rawHeight: 579
                },
                {
                    key: 'coolShades',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses.png',
                    price: 20,
                    name: 'Cool Shades',
                    imageTop: '99px',
                    imageLeft: '23px',
                    imageWidth: '110px',
                    rawWidth: 6073,
                    rawHeight: 2235
                },
                {
                    key: 'shades',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses-aviator.png',
                    price: 20,
                    name: 'Shades',
                    imageTop: '95px',
                    imageLeft: '22px',
                    imageWidth: '110px',
                    rawWidth: 456,
                    rawHeight: 173
                },
                {
                    key: 'harryPotterGlasses',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/sunglasses-swirls.png',
                    price: 20,
                    name: 'Harry Potter Glasses',
                    imageTop: '97px',
                    imageLeft: '22px',
                    imageWidth: '110px',
                    rawWidth: 1038,
                    rawHeight: 340
                },
                {
                    key: 'extremelyCuteUnicornHorn',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/unicorn-horn.png',
                    price: 20,
                    name: 'Extremely Cute Unicorn Horn',
                    imageTop: '-30px',
                    imageLeft: '62px',
                    imageWidth: '35px',
                    rawWidth: 900,
                    rawHeight: 2464
                },
                {
                    key: 'donut',
                    category: ItemCategory.legendary,
                    imagePath: '../../../assets/images/avatar/accessories/donut.png',
                    price: 20,
                    name: 'Donut Pet',
                    imageTop: '123px',
                    imageLeft: '85px',
                    imageWidth: '100px',
                    rawWidth: 793,
                    rawHeight: 785
                },
            ],
            skins: [
                {
                    key: 'default',
                    name: 'default',
                    imagePath: '../../../assets/images/avatar/skins/default.png',
                    rawWidth: 437, 
                    rawHeight: 516
                },
                {
                    key: 'nyanCat',
                    name: 'Nyan Cat',
                    imagePath: '../../../assets/images/avatar/skins/nyan-cat.gif',
                    rawWidth: 437, 
                    rawHeight: 516
                },
            ]
        });

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
