import { Component, OnInit } from '@angular/core';

import { Player } from '../../features/models/player.model';
import { SessionStorageService, SessionStorageKeys } from '../../core/storage/session-storage.service';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

    player: Player;

    constructor(private sessionStorageService: SessionStorageService) { }

    ngOnInit() {
        this.player = this.sessionStorageService.get(SessionStorageKeys.PLAYER_STATE) || Player.resetPlayer();
    }
}
