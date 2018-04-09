import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-post-game',
  templateUrl: './post-game.component.html',
  styleUrls: ['./post-game.component.css']
})
export class PostGameComponent implements OnInit {

  gameData: GameProperties = {
    customerId: this.authenticationService.getCustomer()._id,
    description: '',
    itemName: '',
    tags: '',
    price: null,
    image: null
  };

  constructor(public authenticationService: AuthenticationService, public flightService: FlightService) { }

  ngOnInit() {
  }

  createNewGame() {
    this.flightService.createNewGame(this.gameData).subscribe();
  }

  onFileChanged(event: any) {
    console.log(event.target.files);
    this.gameData.image = event.target.files;
  }

}

export interface GameProperties {
  customerId: String,
  description: String,
  itemName: String,
  tags: String,
  price: Number,
  image: File
}
