import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.css']
})
export class SalesHistoryComponent implements OnInit {

  // Set customer id from auth service
  public customerId = this.authenticationService.getCustomer()._id;
  public totalSales = 0.00;
  public games = [];
  public bookingId: string;

  constructor(public gameService: GameService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // Get customer bookings from customer id
    this.gameService.getSellerGames(this.customerId).subscribe(games => {
      this.games = games;
      this.getCommission();
    });
  }

  getCommission() {
    for (const game of this.games) {
      const commission = game.price * 0.05;
      this.totalSales += game.price - commission;
    }
  }

}
