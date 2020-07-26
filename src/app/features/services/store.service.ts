import { Injectable } from '@angular/core';

import { Store, ItemCategory, Skin } from '../models/store.model';
import { Player } from '../models/player.model';
import { PlayerService } from 'src/app/features/services/player.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    store: Store;

    constructor(private playerService: PlayerService) { }

    init() {
        this.store = new Store([this.addDefaultSkin()]);

        this.resolvePurchases(this.playerService.player);
    }

    /** Figure out which items that user has currently purchased */
    resolvePurchases(player: Player) {
        this.store.skins.forEach(storeSkin => {
            const purchasedAvatar = player.avatars.find(avatar => avatar.skinKey === storeSkin.key);

            if (!purchasedAvatar) { return; }

            if (purchasedAvatar.isActive) { 
                this.store.activeSkin = storeSkin;
                player.activeAvatar = purchasedAvatar;
            }

            storeSkin.accessories.forEach(storeAccessory => {
                const found = purchasedAvatar.accessories.find(purchasedAccessory => storeAccessory.key === purchasedAccessory.key);

                if (found) {
                    storeAccessory.isPurchased = true;
                    storeAccessory.isActive = found.isActive;
                } else {
                    storeAccessory.isPurchased = false;
                }
            });
        });
    }

    addDefaultSkin(): Skin {
        return {
            key: 'default',
            name: 'default',
            imagePath: '../../../assets/images/avatar/skins/default.png',
            rawWidth: 437,
            rawHeight: 516,
            accessories: [
                {
                    key: 'goldenCrown',
                    category: ItemCategory.common,
                    price: 230,
                    name: 'Golden Crown',
                    image: {
                        path: '../../../assets/images/avatar/accessories/crown-gold.png',
                        avatarTop: 11,
                        avatarLeft: 34,
                        avatarWidth: 85,
                        ballTop: 5,
                        ballLeft: 15,
                        ballWidth: 30,
                        ballHeight: 22,
                        rawWidth: 590,
                        rawHeight: 352,
                    },
                },
                {
                    key: 'funnyMask',
                    category: ItemCategory.common,
                    price: 2340,
                    name: 'Funny Mask',
                    image: {
                        path: '../../../assets/images/avatar/accessories/funny-glasses.png',
                        avatarTop: 85,
                        avatarLeft: 28,
                        avatarWidth: 100,
                        ballTop: 33,
                        ballLeft: 8,
                        ballWidth: 44,
                        ballHeight: 30,
                        rawWidth: 250,
                        rawHeight: 188,
                    },

                },
                {
                    key: 'rainbowBow',
                    category: ItemCategory.rare,
                    price: 2110,
                    name: 'Rainbow Bow',
                    image: {
                        path: '../../../assets/images/avatar/accessories/hair-bow-rainbow.png',
                        avatarTop: 10,
                        avatarLeft: 110,
                        avatarWidth: 60,
                        ballTop: 7,
                        ballLeft: 38,
                        ballWidth: 30,
                        ballHeight: 30,
                        rawWidth: 911,
                        rawHeight: 713,
                    },
                },
                {
                    key: 'cuteGlasses',
                    category: ItemCategory.rare,
                    price: 220,
                    name: 'Cute Glasses',
                    image: {
                        path: '../../../assets/images/avatar/accessories/heart-glasses.png',
                        avatarTop: 90,
                        avatarLeft: 23,
                        avatarWidth: 110,
                        ballTop: 35,
                        ballLeft: 11,
                        ballWidth: 40,
                        ballHeight: 20,
                        rawWidth: 238,
                        rawHeight: 102,
                    },
                },
                {
                    key: 'tiaria',
                    category: ItemCategory.ultraRare,
                    price: 420,
                    name: 'Tiaria',
                    image: {
                        path: '../../../assets/images/avatar/accessories/princess-crown.png',
                        avatarTop: 28,
                        avatarLeft: 33,
                        avatarWidth: 90,
                        ballTop: 10,
                        ballLeft: 10,
                        ballWidth: 45,
                        ballHeight: 20,
                        rawWidth: 457,
                        rawHeight: 246
                    },
                },
                {
                    key: 'reallyCuteGlasses',
                    category: ItemCategory.ultraRare,
                    price: 20,
                    name: 'Really Cute Glasses',
                    image: {
                        path: '../../../assets/images/avatar/accessories/rainbow-heart-glasses.png',
                        avatarTop: 90,
                        avatarLeft: 23,
                        avatarWidth: 110,
                        ballTop: 35,
                        ballLeft: 9,
                        ballWidth: 45,
                        ballHeight: 20,
                        rawWidth: 1395,
                        rawHeight: 579,
                    },
                },
                {
                    key: 'coolShades',
                    category: ItemCategory.legendary,
                    price: 20,
                    name: 'Cool Shades',
                    image: {
                        path: '../../../assets/images/avatar/accessories/sunglasses.png',
                        avatarTop: 99,
                        avatarLeft: 23,
                        avatarWidth: 110,
                        ballTop: 35,
                        ballLeft: 8,
                        ballWidth: 45,
                        ballHeight: 18,
                        rawWidth: 6073,
                        rawHeight: 2235,
                    },
                },
                {
                    key: 'shades',
                    category: ItemCategory.legendary,
                    price: 20,
                    name: 'Shades',
                    image: {
                        path: '../../../assets/images/avatar/accessories/sunglasses-aviator.png',
                        avatarTop: 95,
                        avatarLeft: 22,
                        avatarWidth: 110,
                        ballTop: 35,
                        ballLeft: 8,
                        ballWidth: 45,
                        ballHeight: 18,
                        rawWidth: 456,
                        rawHeight: 173,
                    },
                },
                {
                    key: 'harryPotterGlasses',
                    category: ItemCategory.legendary,
                    price: 20,
                    name: 'Harry Potter Glasses',
                    image: {
                        path: '../../../assets/images/avatar/accessories/sunglasses-swirls.png',
                        avatarTop: 97,
                        avatarLeft: 22,
                        avatarWidth: 110,
                        ballTop: 35,
                        ballLeft: 8,
                        ballWidth: 45,
                        ballHeight: 18,
                        rawWidth: 1038,
                        rawHeight: 340,
                    },
                },
                {
                    key: 'extremelyCuteUnicornHorn',
                    category: ItemCategory.legendary,
                    price: 20,
                    name: 'Extremely Cute Unicorn Horn',
                    image: {
                        path: '../../../assets/images/avatar/accessories/unicorn-horn.png',
                        avatarTop: -30,
                        avatarLeft: 62,
                        avatarWidth: 35,
                        ballTop: -15,
                        ballLeft: 24,
                        ballWidth: 15,
                        ballHeight: 40,
                        rawWidth: 900,
                        rawHeight: 2464,
                    },
                },
                {
                    key: 'donut',
                    category: ItemCategory.legendary,
                    price: 20,
                    name: 'Donut Pet',
                    image: {
                        path: '../../../assets/images/avatar/accessories/donut.png',
                        avatarTop: 139,
                        avatarLeft: 85,
                        avatarWidth: 80,
                        ballTop: 57,
                        ballLeft: 32,
                        ballWidth: 37,
                        ballHeight: 37,
                        rawWidth: 793,
                        rawHeight: 785,
                    },
                },
            ],
        };
    }
}


// {
//     key: 'nyanCat',
//     name: 'Nyan Cat',
//     path: '../../../assets/images/avatar/skins/nyan-cat.gif',
//     rawWidth: 437,
//     rawHeight: 516
// },