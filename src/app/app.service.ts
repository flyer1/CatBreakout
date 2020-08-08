import { Injectable } from '@angular/core';

import { PlayerService } from './cat-breakout/services/player.service';
import { StoreService } from './cat-breakout/services/store.service';

@Injectable({ providedIn: 'root' })
export class AppService {

    constructor(private storeService: StoreService, private playerService: PlayerService) { }

    initApplication() {
        this.playerService.init();
        this.storeService.init();
    }
}
