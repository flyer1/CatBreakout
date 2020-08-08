import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './cat-breakout/game/game.component';
import { StoreComponent } from './cat-breakout/store/store.component';
import { AvatarComponent } from './cat-breakout/common/avatar/avatar.component';

@NgModule({
  declarations: [
    AppComponent,
    AvatarComponent,
    GameComponent,
    StoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
