import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(public cartService: CartService) { }

  // When page is loaded
  ngOnInit() {
    // Update items in cart
    this.cartService.updateCart();
    this.cartService.updateFlightsInCart();
    this.cartService.updateGamesInCart();
  }

  // Remove item from cart
  remove(index: number, price: number, distance: number) {
    this.cartService.removeFlight(index, price, distance);
  }

  removeGame(index: number, price: number) {
    this.cartService.removeGame(index, price);
  }

}
