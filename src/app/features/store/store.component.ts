import { Component, OnInit } from '@angular/core';

import { Store, ItemCategory, StoreItem } from '../models/store.model';
import { Player } from '../models/player.model';
import { SessionStorageService, SessionStorageKeys } from 'src/app/core/storage/session-storage.service';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';

@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  store: Store;
  player: Player;

  ///////////////////////////////
  constructor(private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    this.initInventory();
    this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
  }

  confirmPurchase(item: StoreItem) {
    this.store.inventory.forEach(item => item.confirmPurchase = false);
    item.confirmPurchase = true;
  }

  cancelPurchase(item: StoreItem) {
    item.confirmPurchase = false;
  }

  initInventory() {
    this.store = {
      inventory: [
        { category: ItemCategory.common, imagePath: '../../../assets/images/avatar/accessories/crown-gold.png', price: 20, name: 'Golden Crown' },
        { category: ItemCategory.common, imagePath: '../../../assets/images/avatar/accessories/funny-glasses.png', price: 20, name: 'Funny Mask' },
        { category: ItemCategory.rare, imagePath: '../../../assets/images/avatar/accessories/hair-bow-rainbow.png', price: 20, name: 'Rainbow Bow' },
        { category: ItemCategory.rare, imagePath: '../../../assets/images/avatar/accessories/heart-glasses.png', price: 20, name: 'Cute Glasses' },
        { category: ItemCategory.ultraRare, imagePath: '../../../assets/images/avatar/accessories/princess-crown.png', price: 20, name: 'Tiaria' },
        { category: ItemCategory.ultraRare, imagePath: '../../../assets/images/avatar/accessories/rainbow-heart-glasses.png', price: 20, name: 'Really Cute Glasses' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/sunglasses.png', price: 20, name: 'Cool Shades' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/sunglasses-aviator.png', price: 20, name: 'Shades' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/sunglasses-swirls.png', price: 20, name: 'Harry Potter Glasses' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/unicorn-horn.png', price: 20, name: 'Extremely Cute Unicorn Horn', imageWidth: 35 },
      ]
    };
  }
}
