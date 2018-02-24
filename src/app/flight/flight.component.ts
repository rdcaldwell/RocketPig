import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  @Input() private flight: any;

  constructor() { }

  ngOnInit() {
  }

}
