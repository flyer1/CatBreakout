import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from './cat-breakout/models/store.model';
import { PlayerService } from './cat-breakout/services/player.service';
import { StoreService } from './cat-breakout/services/store.service';

@Injectable({ providedIn: 'root' })
export class AppResolve implements Resolve<Store> {

  constructor(private playerService: PlayerService, private storeService: StoreService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): Observable<any> | Promise<any> | any {
    this.playerService.init();
    return this.storeService.init();
  }
}
