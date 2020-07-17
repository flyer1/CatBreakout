import { Component, OnInit } from '@angular/core';

import { Player } from '../../features/models/player.model';
import { AvatarService } from '../avatar/avatar.service';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

    player: Player;

    constructor(private avatarService: AvatarService) { }

    ngOnInit() {
        this.player = this.avatarService.player;
    }
}
