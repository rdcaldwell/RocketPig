import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    username: '',
    password: ''
  };

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {}

  login() {
    $("#loginModal").modal('hide');
    this.authenticationService.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl(`/profile/${this.credentials.username}`);
    }, (err) => {
      console.error(err);
    });
  }
}
