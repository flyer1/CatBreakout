import { Component, OnInit } from '@angular/core';
import { PlayerService } from './shared/avatar/avatar.service';
import { StoreService } from './features/store/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CatBreakout';

  constructor(private storeService: StoreService, private playerService: PlayerService) { }

  ngOnInit() {
    this.playerService.init();
    this.storeService.init();
  }
}
