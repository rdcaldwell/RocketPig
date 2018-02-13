import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'register',
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

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  register() {
    $('#registerModal').modal('hide');
    this.authenticationService.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl(`/profile/${this.credentials.username}`);
    }, (err) => {
      console.error(err);
    });
  }
}
