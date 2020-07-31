import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { Store } from '../models/store.model';
import { Player } from '../models/player.model';
import { PlayerService } from 'src/app/features/services/player.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    store: Store;
    isInitialized: boolean;

    ////////////////////////////////////////////////////////////
    constructor(private playerService: PlayerService, private http: HttpClient) { }

    /** This is called by the routing resolver so it'll be called on every route change */
    init(): Promise<any> {
        return new Promise(resolve => {
            if (this.isInitialized) {
                resolve();
            }

            forkJoin([
                this.http.get('./assets/data/default.skin.json'),
            ]).subscribe((data: any) => {
                this.store = new Store(data);
                this.resolvePurchases(this.playerService.player);
                resolve();
                this.isInitialized = true;
            });
        });
    }

    /** Figure out which items that user has currently purchased */
    resolvePurchases(player: Player) {
        this.store.skins.forEach(storeSkin => {
            const purchasedAvatar = player.avatars.find(avatar => avatar.skinKey === storeSkin.key);

            if (!purchasedAvatar) { return; }

            if (purchasedAvatar.isActive) {
                this.store.activeSkin = storeSkin;
                player.activeAvatar = purchasedAvatar;
            }

            storeSkin.accessories.forEach(storeAccessory => {
                const found = purchasedAvatar.accessories.find(purchasedAccessory => storeAccessory.key === purchasedAccessory.key);

                if (found) {
                    storeAccessory.isPurchased = true;
                    storeAccessory.isActive = found.isActive;
                } else {
                    storeAccessory.isPurchased = false;
                }
            });
        });
    }
}

