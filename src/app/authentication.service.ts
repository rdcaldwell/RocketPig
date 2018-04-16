import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router, CanActivate } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FlightService } from './flight.service';
import { CartService } from './cart.service';

export interface Customer {
  _id: string;
  email: string;
  username: string;
  exp: number;
  iat: number;
  rewardId: string;
  miles: number;
  milesToNextReward: number;
  hasActiveReward: boolean;
  ratings: Array<number>;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email?: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  rewardId?: string;
  miles?: number;
  milesToNextReward?: number;
  hasActiveReward?: boolean;
  ratings?: Array<number>;
}

@Injectable()
export class AuthenticationService implements CanActivate {

  private token: string;

  constructor(private httpClient: HttpClient,
              private http: Http,
              private router: Router,
              private flightService: FlightService,
              private cartService: CartService) {}

  // Activates route if customer is authenticated
  canActivate() {
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

  // Saves user token in session
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  // Gets user token from session
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  // Return customer object from token
  getCustomer(): Customer {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  // Returns if the user is currently logged in
  isLoggedIn(): boolean {
    const customer = this.getCustomer();
    if (customer) {
      return customer.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  // Sends get request with authorization header to profile controller in API
  private getRequest() {
    const base = this.httpClient.get(`/api/profile`, { headers: { Authorization: `Bearer ${this.getToken()}` }});

    return this.request(base);
  }

  // Sends post requests to login and register controllers in API
  private postRequest(type,  user?: TokenPayload): Observable<any> {
    const base = this.httpClient.post(`/api/${type}`, user);

    return this.request(base);
  }

  // Creates request with token
  private request(base) {
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  // Register controller request with token
  register(user: TokenPayload): Observable<any> {
    return this.postRequest('register', user);
  }

  // Login controller request with token
  login(user: TokenPayload): Observable<any> {
    return this.postRequest('login', user);
  }

  // Profile controller request
  profile(): Observable<any> {
    return this.getRequest();
  }

  // Validate form fields
  validate(username, type) {
    return this.http.get(`/api/${type}-validation/${username}`).map(res => res.json());
  }

  // Logout user and end session
  logout(): void {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    this.cartService.updateCart();
    this.cartService.updateFlightsInCart();
    this.router.navigateByUrl('/');
  }
}
