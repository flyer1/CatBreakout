import { Component, OnInit } from '@angular/core';

import { Store } from '../models/store.model';
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
        { category: 'common', asset: '../../foo.png', price: 20, name: 'Glasses' },
        { category: 'common', asset: '../../bar.png', price: 10, name: 'Horn' },
        { category: 'rare', asset: '../../baz.png', price: 30, name: 'Baz' },
      ]
    };
  }
}
