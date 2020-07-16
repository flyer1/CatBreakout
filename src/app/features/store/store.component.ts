import { Component, OnInit } from '@angular/core';

import { Store, ItemCategory } from '../models/store.model';
import { Player } from '../models/player.model';
import { SessionStorageService, SessionStorageKeys } from 'src/app/core/storage/session-storage.service';

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

  initInventory() {
    this.store = {
      inventory: [
        { category: ItemCategory.common, imagePath: '../../../assets/images/avatar/accessories/crown-gold.png', price: 20, name: '' },
        { category: ItemCategory.common, imagePath: '../../../assets/images/avatar/accessories/funny-glasses.png', price: 20, name: '' },
        { category: ItemCategory.rare, imagePath: '../../../assets/images/avatar/accessories/hair-bow-rainbow.png', price: 20, name: '' },
        { category: ItemCategory.rare, imagePath: '../../../assets/images/avatar/accessories/heart-glasses.png', price: 20, name: '' },
        { category: ItemCategory.ultraRare, imagePath: '../../../assets/images/avatar/accessories/princess-crown.png', price: 20, name: '' },
        { category: ItemCategory.ultraRare, imagePath: '../../../assets/images/avatar/accessories/rainbow-heart-glasses.png', price: 20, name: '' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/sunglasses.png', price: 20, name: '' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/sunglasses-aviator.png', price: 20, name: '' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/sunglasses-swirls.png', price: 20, name: '' },
        { category: ItemCategory.legendary, imagePath: '../../../assets/images/avatar/accessories/unicorn-horn.png', price: 20, name: '', imageWidth: 35 },
      ]
    };
  }
}
