import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public travelClasses: Array<any> = [
    {
      class: 'Economy'
    },
    {
      class: 'Business'
    },
    {
      class: 'First'
    }
  ];

  public fareClasses: Array<any> = [
    {
      class: 'Adult'
    },
    {
      class: 'Senior'
    },
    {
      class: 'Child'
    }
  ];

  constructor(public flightService: FlightService,
  private router: Router) { }

  ngOnInit() {
  }

  // Navigates to departure flights where flights are filtered using search parameters
  search() {
    this.router.navigateByUrl('/flights/departure');
  }
}
