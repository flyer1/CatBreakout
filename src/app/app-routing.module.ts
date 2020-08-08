import { NgModule } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GameComponent } from './cat-breakout/game/game.component';
import { StoreComponent } from './cat-breakout/store/store.component';
import { AppResolve } from './app-routing-resolvers';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  { path: 'game', component: GameComponent, resolve: { skin: AppResolve } },
  { path: 'store', component: StoreComponent, resolve: { skin: AppResolve } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

