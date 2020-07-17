import { Component, OnInit } from '@angular/core';

import { Store, StoreItem } from '../models/store.model';
import { Player } from '../models/player.model';
import { StoreService } from './store.service';
import { SessionStorageService, SessionStorageKeys } from 'src/app/core/storage/session-storage.service';

@Component({
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  store: Store;
  player: Player;

  ///////////////////////////////
  constructor(private storeService: StoreService, private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    this.store = this.storeService.getInventory();
    this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
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
  }
}
