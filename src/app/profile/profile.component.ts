import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Customer } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  customerProfile: Customer;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.profile().subscribe(customer => {
      this.customerProfile = customer;
    }, (err) => {
      console.error(err);
    });
  }

}
