import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupLoginComponent } from './components/signup-login/signup-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { GetAllBooksComponent } from './components/get-all-books/get-all-books.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'login', component: SignupLoginComponent},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'books', component: GetAllBooksComponent },
      { path: '', redirectTo: '/books', pathMatch: 'full' },
      { path: 'book-detail', component: BookDetailComponent},
      { path: 'cart', component: CartComponent },
      { path: 'wishlist', component: WishlistComponent }
    ],
  },
  { path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
