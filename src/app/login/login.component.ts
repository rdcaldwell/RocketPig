import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-login',
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

  ngOnInit() {
    $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')
    })
   }

  login() {
    this.authenticationService.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl(`/profile/${this.credentials.username}`);
    }, (err) => {
      console.error(err);
    });
  }
}
