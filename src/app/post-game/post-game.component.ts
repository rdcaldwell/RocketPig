import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-post-game',
  templateUrl: './post-game.component.html',
  styleUrls: ['./post-game.component.css']
})
export class PostGameComponent implements OnInit {

  public filename = 'Choose file';
  public gameData: GameProperties = {
    customerId: this.authenticationService.getCustomer()._id,
    description: '',
    itemName: '',
    tags: '',
    price: null,
    image: null
  };

  constructor(public authenticationService: AuthenticationService, public gameService: GameService) { }

  ngOnInit() {
  }

  createNewGame() {
    this.gameService.createNewGame(this.gameData).subscribe(data => {
      alert(data);
    });
  }

  onFileChanged(event: any) {
    if (event.target.files[0].size > 70000) {
      alert('The image file is too large. Upload a file less than 70 KB.');
    } else {
      const reader = new FileReader();
      const image = event.target.files[0];
      reader.readAsDataURL(image);
      reader.onload = () => {
        this.gameData.image = reader.result.split(',')[1];
        this.filename = image.name;
      };
    }
  }

}

export interface GameProperties {
  customerId: String;
  description: String;
  itemName: String;
  tags: String;
  price: Number;
  image: File;
}
