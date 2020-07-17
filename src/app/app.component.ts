import { Component, OnInit } from '@angular/core';
import { AvatarService } from './shared/avatar/avatar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CatBreakout';

  constructor(private avatarService: AvatarService) { }

  ngOnInit() {
    this.avatarService.init();
  }
}
