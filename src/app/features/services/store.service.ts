import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, BehaviorSubject } from 'rxjs';

import { Store, Accessory, Skin } from '../models/store.model';
import { Player } from '../models/player.model';
import { PlayerService } from 'src/app/features/services/player.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    store: Store;
    isInitialized: boolean;

    private skinChanged = new BehaviorSubject<Skin>(null);
    // skinChanged$: Observable<Skin>;
    skinChanged$ = this.skinChanged.asObservable();

    ////////////////////////////////////////////////////////////
    constructor(private playerService: PlayerService, private http: HttpClient) { }

    /** This is called by the routing resolver so it'll be called on every route change */
    init(): Promise<any> {
        return new Promise(resolve => {
            if (this.isInitialized) {
                resolve();
            }

            // Load up all of the skins into the store
            forkJoin([
                this.http.get('./assets/data/default.skin.json'),
                this.http.get('./assets/data/nyan-cat.skin.json'),
                this.http.get('./assets/data/crook-shanks.skin.json'),
                this.http.get('./assets/data/rainbow-cat.skin.json'),
            ]).subscribe((data: any) => {
                this.store = new Store(data);

                // Figure out what the player has already purchased from the store.
                this.resolvePurchases(this.playerService.player);
                this.isInitialized = true;
                resolve();
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
                this.store.activeSkin.isActive = true;
                player.activeAvatar = purchasedAvatar;
            } else {
                storeSkin.isActive = false;
            }

            storeSkin.accessories.forEach(storeAccessory => {
                const found = purchasedAvatar.accessories.find(purchasedAccessory => storeAccessory.key === purchasedAccessory.key);

                if (found) {
                    storeAccessory.isPurchased = true;
                    storeAccessory.isActive = found.isActive;
                } else {
                    storeAccessory.isPurchased = false;
                    storeAccessory.isActive = false;
                }
            });
        });
        this.skinChanged.next(this.store.activeSkin);
    }

    purchaseAccessory(accessory: Accessory) {
        accessory.isPurchased = true;
        accessory.isActive = true;
        accessory.confirmPurchase = false;
    }
}

