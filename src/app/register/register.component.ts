import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: null
  };

  usernameFound: boolean;
  emailFound: boolean;
  passwordCheck: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  validateUsername() {
    if (this.credentials.username) {
      this.authenticationService.validate(this.credentials.username, 'username').subscribe(data => {
        this.usernameFound = data.found;
      });
    }
  }

  validateEmail() {
    if (this.credentials.email) {
      this.authenticationService.validate(this.credentials.email, 'email').subscribe(data => {
        this.emailFound = data.found;
      });
    }
  }

  register() {
    // TODO: add validation on register
    this.authenticationService.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl(`/profile/${this.credentials.username}`);
    }, (err) => {
      console.error(err);
    });
  }
}
