import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class DistanceService {

  constructor(private http: Http) { }

  getDistance(origin, destination) {
    this.http
      .get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+origin+"&destinations="+destination+"&key=AIzaSyBOTqGI8-PN-Lg3AQT07oULRVmL4o0o5wg")
      .map(res => res.json());
  }

}
