import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './sidebar-search.component.html',
  styleUrls: ['./sidebar-search.component.css']
})
export class SidebarSearchComponent implements OnInit {
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
    // Sets flights in service
    this.flightService.setFlights();
    this.router.navigateByUrl('/flights/departure');
  }
}
