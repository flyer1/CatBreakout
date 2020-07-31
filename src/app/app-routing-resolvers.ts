import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from './features/models/store.model';
import { PlayerService } from './features/services/player.service';
import { StoreService } from './features/services/store.service';

@Injectable({ providedIn: 'root' })
export class AppResolve implements Resolve<Store> {

  constructor(private playerService: PlayerService, private storeService: StoreService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,): Observable<any> | Promise<any> | any {
    this.playerService.init();
    return this.storeService.init();
  }
}
