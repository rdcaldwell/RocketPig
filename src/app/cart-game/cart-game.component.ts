import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { GameService } from '../game.service';
import { FlightService } from '../flight.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart-game',
  templateUrl: './cart-game.component.html',
  styleUrls: ['./cart-game.component.css']
})
export class CartGameComponent implements OnInit {

  @Input() public game: any;
  public gameImage: SafeResourceUrl;

  constructor(public gameService: GameService,
    private sanitizer: DomSanitizer) { }
    public imageLoading = true;

  ngOnInit() {
    this.gameService.getGameImage(this.game._id).subscribe(data => {
      const image = (<any>data)._body;
      const url = 'data:image/png;base64,' + image;
      this.gameImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.imageLoading = false;
    });
  }

}
