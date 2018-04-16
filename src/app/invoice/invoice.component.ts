import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FlightService } from '../flight.service';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../game.service';
import { RatingChangeEvent } from 'angular-star-rating';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  // Gets customer profile from auth service
  customerProfile = this.authenticationService.getCustomer();
  bookingId: string;
  booking: any = {};
  flights: any = [];
  tickets: any = [];
  games: any = [];
  rating: number;

  constructor(private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private flightService: FlightService,
    private gameService: GameService) { }

  // On page load
  ngOnInit() {
    // Gets booking id from url parameters
    this.activatedRoute.params.subscribe(params => {
      this.bookingId = params['id'];
    });
    // Gets booking from api using booking id
    this.flightService.getBooking(this.bookingId).subscribe(booking => {
      this.booking = booking;
      for (const ticket of this.booking.tickets) {
        // Gets all tickets from booking
        this.flightService.getTicket(ticket).subscribe(ticketData => {
          this.tickets.push(ticketData);
          // Gets each flight from ticket
          this.flightService.getFlight(ticketData.flight).subscribe(flightData => {
            this.flights.push(flightData);
          });
        });
      }
      for (const game of this.booking.games) {
        this.gameService.getGame(game).subscribe(gameData => {
          this.games.push(gameData);
        });
      }
    });
  }

  onRatingChange(event: RatingChangeEvent) {
    this.rating = event.rating;
  }

  submitRating(sellerId) {
    this.gameService.postSellerRating(sellerId, this.rating).subscribe(data => {
      alert(data);
    });
  }

}
