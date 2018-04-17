import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class FlightService {

  public availableFlights: any = [];
  public searchParameters: SearchProperties = {
    departure: '',
    destination: '',
    travelClass: '',
    fareClass: '',
    bookingType: 'OneWay',
    departDate: new Date(),
    returnDate: new Date(),
    firstBooked: false,
    stops: 0
  };

  constructor(private http: Http) { }

  // Get flight paths from API
  getFlights() {
    return this.http.post(`/api/flights`, this.searchParameters).map(res => res.json());
  }

  // Get all flights from API
  getAllFlights() {
    return this.http.get(`/api/flights/all`).map(res => res.json());
  }

  // Sets flights for display in application
  setFlights() {
    this.getFlights().subscribe(data => {
      this.availableFlights = data;
    });
  }

  // Get customer bookings from API with customerId
  getCustomerBookings(id) {
    return this.http.get(`/api/bookings/customer/${id}`).map(res => res.json());
  }

  // Get flight from API with id
  getFlight(id) {
    return this.http.get(`/api/flight/${id}`).map(res => res.json());
  }

  // Get booking from API with id
  getBooking(id) {
    return this.http.get(`/api/booking/${id}`).map(res => res.json());
  }

  // Get ticket from API with id
  getTicket(id) {
    return this.http.get(`/api/ticket/${id}`).map(res => res.json());
  }

  // Create booking from data
  postBooking(data) {
    return this.http.post(`/api/booking/new`, data).map(res => res.json());
  }

  // Create tickets from data
  postTickets(data) {
    return this.http.post(`/api/tickets/new`, data).map(res => res.json());
  }
}

interface SearchProperties {
  departure: string;
  destination: string;
  travelClass: string;
  fareClass: string;
  bookingType: string;
  departDate: Date;
  returnDate: Date;
  firstBooked: boolean;
  stops: Number;
}
