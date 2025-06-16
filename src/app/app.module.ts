import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupLoginComponent } from './components/signup-login/signup-login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule }        from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GetAllBooksComponent } from './components/get-all-books/get-all-books.component';
import { DisplayBookComponent } from './components/display-book/display-book.component';
import { FilterPipe } from './services/filter/filter.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { MatRadioModule } from '@angular/material/radio';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PlaceOrderComponent } from './components/order-details/place-order.component';
import { ConfirmOrderComponent } from './components/confirm-order/confirm-order.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupLoginComponent,
    DashboardComponent,
    GetAllBooksComponent,
    DisplayBookComponent,
    FilterPipe,
    BookDetailComponent,
    CartComponent,
    WishlistComponent,
    PlaceOrderComponent,
    ConfirmOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
