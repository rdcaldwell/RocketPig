import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class GameService {

  public searchQuery: string;

  constructor(private http: Http) { }

  createNewGame(gameData) {
    return this.http.post(`/api/game/new`, gameData).map(res => res.json());
  }

  getGames() {
    return this.http.get('/api/games').map(res => res.json());
  }

  getSellerGames(id) {
    return this.http.get(`/api/games/seller/${id}`).map(res => res.json());
  }

  postSellerRating(id, rating) {
    return this.http.post(`/api/seller/rating`, {
      id: id,
      rating: rating
    }).map(res => res.json());
  }

  getSellerMessages(id) {
    return this.http.get(`/api/messages/seller/${id}`).map(res => res.json());
  }

  getGame(id) {
    return this.http.get(`/api/game/${id}`).map(res => res.json());
  }

  getGameImage(id) {
    return this.http.get(`/api/game/img/${id}`).map(res => res);
  }

  getUser(id) {
    return this.http.get(`/api/user/${id}`).map(res => res.json());
  }

}
