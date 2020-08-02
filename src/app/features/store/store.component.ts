import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, Accessory, Skin } from '../models/store.model';
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
  constructor(private route: ActivatedRoute, private storeService: StoreService, private playerService: PlayerService) { }

  ngOnInit(): void {
    console.log(this.route.snapshot);
    this.store = this.storeService.store;
    this.player = this.playerService.player;
  }

  confirmPurchase(item: Accessory) {
    this.store.activeSkin.accessories.forEach(item => item.confirmPurchase = false);
    item.confirmPurchase = true;
  }

  cancelPurchase(item: Accessory) {
    item.confirmPurchase = false;
  }

  purchaseItem(item: Accessory) {
    this.storeService.purchaseAccessory(item);
    this.player.activeAvatar.accessories.push({ key: item.key, isActive: true});
    this.playerService.updateStorage();
  }

  toggleAccessory(item: Accessory) {
    item.isActive = !item.isActive;
    
    const found = this.player.activeAvatar.accessories.find(accessory => accessory.key === item.key);
    if (found) { 
      found.isActive = item.isActive;
      this.playerService.updateStorage();
    }
  }

  makeSkinDefault(skin: Skin) {
    this.player.avatars.forEach(avatar => avatar.isActive = (avatar.skinKey === skin.key));
    this.storeService.resolvePurchases(this.player);
    this.playerService.updateStorage();
  }

  selectTab(key: TabCode) {
    this.activeTab = key;
  }

}

declare type TabCode = 'accessories' | 'skins';
