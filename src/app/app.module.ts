import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlightsComponent } from './flights/flights.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './authentication.service';
import { LoginComponent } from './login/login.component';
import { ActivateService } from './activate.service';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HistoryComponent } from './history/history.component';
import { OrderPreviewComponent } from './order-preview/order-preview.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'flights', component: FlightsComponent },
  { path: 'order-preview/:id', component: OrderPreviewComponent },
  { path: 'invoice/:id', component: ConfirmationComponent },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [ActivateService] },
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
    ConfirmationComponent,
    HistoryComponent,
    OrderPreviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    AuthenticationService,
    ActivateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
