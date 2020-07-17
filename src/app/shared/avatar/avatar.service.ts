import { Injectable } from '@angular/core';

import { Player } from '../../features/models/player.model';
import { SessionStorageService, SessionStorageKeys } from '../../core/storage/session-storage.service';

@Injectable({ providedIn: 'root' })
export class AvatarService {

    player: Player;

    constructor(private sessionStorageService: SessionStorageService) { }

    init() {
        this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
    }
}
