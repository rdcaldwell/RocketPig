import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  credentials: TokenPayload = {
    username: '',
    password: ''
  };
  incorrectPassword = false;
  userNotFound = false;

  constructor(public authenticationService: AuthenticationService,
              private router: Router,
              private flightService: FlightService) {}

  // Login user
  login() {
    this.incorrectPassword = false;
    this.userNotFound = false;
    // Call api to login user
    this.authenticationService.login(this.credentials).subscribe(() => {
      // Update cart items
      this.flightService.updateCart();
      // Navigate to profile
      this.router.navigateByUrl(`/${this.credentials.username}`);
    }, (err) => {
      // Login validations
      if (err.error.message === 'User not found') {
        this.userNotFound = true;
      } else if (err.error.message === 'Password is wrong') {
        this.incorrectPassword = true;
      }
    });
  }
}
