import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  public games: any = [];
  public loading: boolean;

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.loading = true;
    this.gameService.getGames().subscribe(data => {
      this.loading = false;
      this.games = data;
    });
  }

}
