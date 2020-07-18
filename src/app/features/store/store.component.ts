import { Component, OnInit } from '@angular/core';

import { Store, Accessory } from '../models/store.model';
import { Player } from '../models/player.model';
import { StoreService } from '../services/store.service';
import { PlayerService } from 'src/app/features/services/player.service';

@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  store: Store;
  player: Player;
  activeTab: TabCode = 'accessories';

  ///////////////////////////////
  constructor(private storeService: StoreService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.store = this.storeService.store;
    this.player = this.playerService.player;

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
    item.isActive = true;
    item.confirmPurchase = false;
    this.player.avatar.accessories.push({ key: item.key, isActive: true});
    this.playerService.updateStorage();
  }

  toggleAccessory(item: Accessory) {
    item.isActive = !item.isActive;
    
    const found = this.player.avatar.accessories.find(accessory => accessory.key === item.key);
    if (found) { 
      found.isActive = item.isActive;
      this.playerService.updateStorage();
    }
  }

  selectTab(key: TabCode) {
    this.activeTab = key;
  }

}

declare type TabCode = 'accessories' | 'skins';
