import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(public flightService: FlightService) { }

  ngOnInit() {
    this.flightService.updateCart();
    this.flightService.updateFlightsInCart();
  }

  remove(index: number, price: number) {
    this.flightService.removeFlight(index, price);
  }

}
