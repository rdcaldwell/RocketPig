import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { GameService } from '../game.service';
import { FlightService } from '../flight.service';
import { CartService } from '../cart.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Input() public game: any;
  public gameImage: SafeResourceUrl;
  public user: any = {};
  public cart: any = {};
  public data: {};
  public imageLoading = true;
  public customerId: string;
  public averageRating: any;

  constructor(public gameService: GameService,
    public flightService: FlightService,
    private cartService: CartService,
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService) { }


  ngOnInit() {
    // Sets user id if user is logged in
    if (this.authenticationService.isLoggedIn()) {
      this.customerId = this.authenticationService.getCustomer()._id;
    } else {
      this.customerId = null;
    }

    this.gameService.getGameImage(this.game._id).subscribe(data => {
      const image = (<any>data)._body;
      const url = 'data:image/png;base64,' + image;
      this.gameImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.imageLoading = false;
    });

    this.gameService.getUser(this.game.personId).subscribe(data => {
      this.user = data;
      this.getAverageRating();
    });

    // Data object for cart
    this.data = {
      games: [this.game],
      bookingData: {
        customerId: this.customerId,
        total: this.game.price,
        totalMiles: 0,
        tickets: []
      },
      ticketData: [],
    };
  }

  // Adds items to cart
  addToCart() {
    // Gets cart data from session
    this.cart = JSON.parse(localStorage.getItem('cart'));
    if (this.cart == null) {
      // Creates new cart object from data if null
      this.cart = this.data;
    } else {
      // Adds all ticket data to cart
      this.cart.games.push(this.game);
      // Update cart toal
      this.cart.bookingData.total += this.game.price;
    }
    // Save cart to session
    localStorage.setItem('cart', JSON.stringify(this.cart));
    // Update cart contents
    this.cartService.updateCart();
    this.cartService.updateGamesInCart();
    alert(`${this.game.itemName} added to cart`);
  }

  getAverageRating() {
    let total = 0;
    for (const rating of this.user.ratings) {
      total += rating;
    }
    this.averageRating = total / this.user.ratings.length;
  }

}
