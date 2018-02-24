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

  login() {
    this.incorrectPassword = false;
    this.userNotFound = false;
    this.authenticationService.login(this.credentials).subscribe(() => {
      this.flightService.updateCart();
      this.router.navigateByUrl(`/${this.credentials.username}`);
    }, (err) => {
      if (err.error.message === 'User not found') {
        this.userNotFound = true;
      } else if (err.error.message === 'Password is wrong') {
        this.incorrectPassword = true;
      }
    });
  }
}
