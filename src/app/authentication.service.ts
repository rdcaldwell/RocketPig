import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router, CanActivate } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FlightService } from './flight.service';

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
}

@Injectable()
export class AuthenticationService implements CanActivate {

  private token: string;

  constructor(private httpClient: HttpClient,
              private http: Http,
              private router: Router,
              private flightService: FlightService) {}

  canActivate() {
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

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

  isLoggedIn(): boolean {
    const customer = this.getCustomer();
    if (customer) {
      return customer.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private getRequest() {
    const base = this.httpClient.get(`/api/profile`, { headers: { Authorization: `Bearer ${this.getToken()}` }});

    return this.request(base);
  }

  private postRequest(type,  user?: TokenPayload): Observable<any> {
    const base = this.httpClient.post(`/api/${type}`, user);

    return this.request(base);
  }

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

  register(user: TokenPayload): Observable<any> {
    return this.postRequest('register', user);
  }

  login(user: TokenPayload): Observable<any> {
    return this.postRequest('login', user);
  }

  profile(): Observable<any> {
    return this.getRequest();
  }

  validate(username, type) {
    return this.http.get(`/api/${type}-validation/${username}`).map(res => res.json());
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    this.flightService.updateCart();
    this.flightService.updateFlightsInCart();
    this.router.navigateByUrl('/');
  }
}
