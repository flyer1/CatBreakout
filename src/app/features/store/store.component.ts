import { Component, OnInit } from '@angular/core';

import { Store, Accessory } from '../models/store.model';
import { Player } from '../models/player.model';
import { StoreService } from './store.service';
import { AvatarService } from 'src/app/shared/avatar/avatar.service';

@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  store: Store;
  player: Player;
  activeTab: TabCode = 'accessories';

  ///////////////////////////////
  constructor(private storeService: StoreService, private avatarService: AvatarService) { }

  ngOnInit(): void {
    this.store = this.storeService.store;
    this.player = this.avatarService.player;

    this.init()
  }

  init() {
    // Merge the purchased items with the inventory
    // this.store.inventory.forEach(item => item.purchased = )
  }

  confirmPurchase(item: Accessory) {
    this.store.accessories.forEach(item => item.confirmPurchase = false);
    item.confirmPurchase = true;
  }

  cancelPurchase(item: Accessory) {
    item.confirmPurchase = false;
  }

  purchaseItem(item: Accessory) {
    item.purchased = true;
    item.confirmPurchase = false;
    this.player.avatar.accessories.push(item.key);
    this.avatarService.updateStorage();
  }

  selectTab(key: TabCode) {
    this.activeTab = key;
  }

}

declare type TabCode = 'accessories' | 'skins';
