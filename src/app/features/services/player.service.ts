import { Injectable } from '@angular/core';

import { Player } from '../models/player.model';
import { SessionStorageService, SessionStorageKeys } from '../../core/storage/session-storage.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {

    player: Player;

    constructor(private sessionStorageService: SessionStorageService) { }

    init() {
        this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
    }

    updateStorage() {
        this.sessionStorageService.set(SessionStorageKeys.PLAYER_STATE, this.player);
    }
}