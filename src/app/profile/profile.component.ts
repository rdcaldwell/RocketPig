import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Customer } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public customerProfile: Customer;
  public averageRating: number;

  constructor(private authenticationService: AuthenticationService) { }

  // On page load
  ngOnInit() {
    // Gets profile from auth service
    this.authenticationService.profile().subscribe(customer => {
      this.customerProfile = customer;
      this.getAverageRating();
    }, (err) => {
      console.error(err);
    });
  }

  getAverageRating() {
    let total = 0;
    for (const rating of this.customerProfile.ratings) {
      total += rating;
    }
    this.averageRating = total / this.customerProfile.ratings.length;
  }

}
