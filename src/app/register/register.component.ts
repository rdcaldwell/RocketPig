import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public usernameFound: boolean;
  public emailFound: boolean;
  public passwordCheck: boolean;
  public credentials: TokenPayload = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: null,
    miles: 0
  };

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  // Validate username
  validateUsername() {
    // If entered username is not blank
    if (this.credentials.username) {
      // Validate if username is taken in api
      this.authenticationService.validate(this.credentials.username, 'username').subscribe(data => {
        this.usernameFound = data.found;
      });
    }
  }

  // Validate email
  validateEmail() {
    // If entered email is not blank
    if (this.credentials.email) {
      // Validate if email is taken in api
      this.authenticationService.validate(this.credentials.email, 'email').subscribe(data => {
        this.emailFound = data.found;
      });
    }
  }

  // Register user
  register() {
    // Register user using enter parameters
    this.authenticationService.register(this.credentials).subscribe(() => {
      // Navigate to profile
      this.router.navigateByUrl(`/${this.credentials.username}`);
    }, (err) => {
      console.error(err);
    });
  }
}
