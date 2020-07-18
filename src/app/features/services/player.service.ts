import { Injectable } from '@angular/core';

import { Player } from '../models/player.model';
import { SessionStorageService, SessionStorageKeys } from '../../core/storage/session-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {

    private playerChanged = new BehaviorSubject<void>(null);
    playerChanged$ = this.playerChanged.asObservable();

    player: Player;

    ////////////////////////////////////////////////////////////
    constructor(private sessionStorageService: SessionStorageService) { }

    init() {
        this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
    }

    updateStorage() {
        this.sessionStorageService.set(SessionStorageKeys.PLAYER_STATE, this.player);
        this.playerChanged.next();
    }
}
