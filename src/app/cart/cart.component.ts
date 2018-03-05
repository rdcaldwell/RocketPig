import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(public flightService: FlightService) { }

  // When page is loaded
  ngOnInit() {
    // Update items in cart
    this.flightService.updateCart();
    this.flightService.updateFlightsInCart();
  }

  // Remove item from cart
  remove(index: number, price: number, distance: number) {
    this.flightService.removeFlight(index, price, distance);
  }

}
