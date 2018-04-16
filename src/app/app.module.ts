import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
import { AppComponent } from './app.component';
import { FlightsComponent } from './flights/flights.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './authentication.service';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { HistoryComponent } from './history/history.component';
import { BookingComponent } from './booking/booking.component';
import { FlightPackageComponent } from './flight-package/flight-package.component';
import { SearchComponent } from './search/search.component';
import { FlightService } from './flight.service';
import { MomentModule } from 'angular2-moment';
import { FlightComponent } from './flight/flight.component';
import { TicketComponent } from './ticket/ticket.component';
import { CartComponent } from './cart/cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { SidebarSearchComponent } from './sidebar-search/sidebar-search.component';
import { FooterComponent } from './footer/footer.component';
import { PostGameComponent } from './post-game/post-game.component';
import { GameComponent } from './game/game.component';
import { GamesComponent } from './games/games.component';
import { GameService } from './game.service';
import { CartService } from './cart.service';
import { CartGameComponent } from './cart-game/cart-game.component';
import { SalesHistoryComponent } from './sales-history/sales-history.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'flights/departure', component: FlightsComponent },
  { path: 'flights/return', component: FlightsComponent },
  { path: 'games', component: GamesComponent },
  { path: 'booking', component: BookingComponent },
  { path: ':username', component: ProfileComponent, canActivate: [AuthenticationService] },
  { path: 'invoice/:id', component: InvoiceComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    FlightsComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    HeaderComponent,
    HomeComponent,
    InvoiceComponent,
    HistoryComponent,
    BookingComponent,
    FlightPackageComponent,
    SearchComponent,
    FlightComponent,
    TicketComponent,
    CartComponent,
    SidebarSearchComponent,
    FooterComponent,
    PostGameComponent,
    GameComponent,
    GamesComponent,
    CartGameComponent,
    SalesHistoryComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MomentModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    RouterModule.forRoot(routes),
    StarRatingModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    FlightService,
    GameService,
    CartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
