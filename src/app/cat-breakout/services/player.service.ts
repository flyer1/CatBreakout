import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Player } from '../models/player.model';
import { CookieStorageService, CookieStorageKeys } from '../../core/storage/cookie-storage.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {

    private playerChanged = new BehaviorSubject<void>(null);
    playerChanged$ = this.playerChanged.asObservable();

    private levelChanged = new BehaviorSubject<number>(null);
    levelChanged$ = this.levelChanged.asObservable();

    player: Player;
    isInitialized: boolean;

    ////////////////////////////////////////////////////////////
    constructor(private cookieStorageService: CookieStorageService) { }

    /** This is called by the routing resolver so it'll be called on every route change */
    public init() {
        if (this.isInitialized) { return; }

        this.player = this.cookieStorageService.get(CookieStorageKeys.PLAYER_STATE) || Player.resetPlayer();
        this.isInitialized = true;
    }

    updateStorage() {
        const prevLevel = this.player.level;
        Player.computeLevel(this.player);
        Player.unlockSkin(this.player);

        if (prevLevel !== this.player.level) {
            this.levelChanged.next(this.player.level);
        }

        const playerToSave = Object.assign({}, this.player);
        delete playerToSave.activeAvatar;
        this.cookieStorageService.set({name: CookieStorageKeys.PLAYER_STATE, value: playerToSave, session: true});
        this.playerChanged.next();
    }
}
