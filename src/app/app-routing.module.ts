import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './cat-breakout/game/game.component';
import { StoreComponent } from './cat-breakout/store/store.component';
import { GameResolve, CovidTrackerResolve } from './app-routing-resolvers';
import { CovidTrackerComponent } from './covid-tracker/home/covid-tracker.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  { path: 'game', component: GameComponent, resolve: { skin: GameResolve } },
  { path: 'store', component: StoreComponent, resolve: { skin: GameResolve } },
  { path: 'covid-tracker', component: CovidTrackerComponent, resolve: { school: CovidTrackerResolve } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

