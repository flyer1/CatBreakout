import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Player } from '../../features/models/player.model';
import { PlayerService } from '../../features/services/player.service';
import { StoreService } from 'src/app/features/services/store.service';
import { Store } from 'src/app/features/models/store.model';
import { BaseComponent } from '../../core/base-component';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush // The avatar doesn't change state often so let's manually control in order to save on cycles
})
export class AvatarComponent extends BaseComponent implements OnInit {

    player: Player;
    store: Store;

    //////////////////////////////

    constructor(private playerService: PlayerService, private storeService: StoreService, private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.player = this.playerService.player;
        this.store = this.storeService.store;

        this.playerService.playerChanged$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(_ => {
                // Tell Angular to update the data binding
                this.cdr.markForCheck();
            });
    }
}
