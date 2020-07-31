import { Injectable } from '@angular/core';

import { Player } from '../models/player.model';
import { SessionStorageService, SessionStorageKeys } from '../../core/storage/session-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {

    private playerChanged = new BehaviorSubject<void>(null);
    playerChanged$ = this.playerChanged.asObservable();

    player: Player;
    isInitialized: boolean;

    ////////////////////////////////////////////////////////////
    constructor(private sessionStorageService: SessionStorageService) { }

    /** This is called by the routing resolver so it'll be called on every route change */
    public init() {
        if (this.isInitialized) { return; }

        this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
        this.isInitialized = true;
    }

    updateStorage() {
        Player.computeLevel(this.player);
        const playerToSave = Object.assign({}, this.player);
        delete playerToSave.activeAvatar;
        this.sessionStorageService.set(SessionStorageKeys.PLAYER_STATE, playerToSave);
        this.playerChanged.next();
    }
}
