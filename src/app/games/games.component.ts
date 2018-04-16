import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  public games: any = [];

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.getGames().subscribe(data => {
      this.games = data;
    });
  }

}
