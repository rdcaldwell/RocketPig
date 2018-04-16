import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public messages = [];
  public sellerId = this.authenticationService.getCustomer()._id;
  public totalMessages: number;

  constructor(public gameService: GameService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.gameService.getSellerMessages(this.sellerId).subscribe(messages => {
      this.messages = messages;
      this.totalMessages = messages.length;
    });
  }

}
