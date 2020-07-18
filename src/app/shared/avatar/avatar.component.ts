import { Component, OnInit } from '@angular/core';

import { Player } from '../../features/models/player.model';
import { PlayerService } from '../../features/services/player.service';
import { StoreService } from 'src/app/features/services/store.service';
import { Store } from 'src/app/features/models/store.model';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

    player: Player;
    store: Store;

    //TODO: get control of change detection cycle.

    constructor(private playerService: PlayerService, private storeService: StoreService) { }

    ngOnInit() {
        this.player = this.playerService.player;
        this.store = this.storeService.store;
    }
}
