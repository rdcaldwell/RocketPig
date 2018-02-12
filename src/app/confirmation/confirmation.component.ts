import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Customer } from '../authentication.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
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
