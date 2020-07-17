import { Component, OnInit } from '@angular/core';

import { Store, StoreItem } from '../models/store.model';
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
    this.store = this.storeService.getInventory();
    this.player = this.avatarService.player;
  }

  confirmPurchase(item: StoreItem) {
    this.store.inventory.forEach(item => item.confirmPurchase = false);
    item.confirmPurchase = true;
  }

  cancelPurchase(item: StoreItem) {
    item.confirmPurchase = false;
  }

  purchaseItem(item: StoreItem) {
    item.purchased = true;
    item.confirmPurchase = false;
    this.player.avatar.accessories.push(item);
  }

  selectTab(key: TabCode) {
    this.activeTab = key;
  }

}

declare type TabCode = 'accessories' | 'skins';
