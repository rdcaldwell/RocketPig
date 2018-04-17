import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {

  @Input() public flight: any;
  public airlineCode: string;

  constructor() { }

  ngOnInit() {
    this.setAirlineCodes();
  }

  // Sets airline codes for pictures
  setAirlineCodes() {
    if (this.flight.airline === 'American Airlines') {
      this.airlineCode = 'aa';
    } else if (this.flight.airline === 'United Airlines') {
      this.airlineCode = 'united';
    } else if (this.flight.airline === 'Delta Airlines') {
      this.airlineCode = 'delta';
    } else if (this.flight.airline === 'Frontier Airlines') {
      this.airlineCode = 'front';
    }
  }
}
