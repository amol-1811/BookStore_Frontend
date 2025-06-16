import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book/book.service';
import { DataService } from 'src/app/services/data/data.service';
import { SearchService } from 'src/app/services/search/search.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  searchText: string = '';
  userName: string = 'user';
  cartItemsCount: number = 0;
  cartBook: any[] = [];
  
  private cartCountSubscription: Subscription = new Subscription();

  constructor(
    private searchService: SearchService, 
    private bookService: BookService, 
    private dataService: DataService, 
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.createCartIfNotExists();
    this.initializeCartBadge();
    const userString = localStorage.getItem('registeredUser');
    if (userString !== null && userString !== undefined) {
      const firstName = userString.split(' ')[0];
      this.userName = firstName || 'user';
      console.log("User name found in local storage:", this.userName);
    } else {
      console.warn("User name not found in local storage");
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }

  private createCartIfNotExists(): void {
    this.cartService.getCart()
    .subscribe({
      next: response => {
        console.log("Cart already exists for user");
      },
      error: err => {
        console.warn("Cart does not exists for the user. Creating a new cart");
        this.cartService.createCart()
        .subscribe({
          next: resp => {
            console.log(`Cart is created for the user successfully. ${resp?.data}`);
          },
          error: err => {
            console.log("Unable to create the cart. Please try later");
          }
        });
      }
    })
  }

  private initializeCartBadge(): void {
    // Subscribe to cart count changes
    this.cartCountSubscription = this.cartService.cartItemsCount$.subscribe(
      (count: number) => {
        this.cartItemsCount = count;
        console.log('Dashboard - Cart badge count updated:', count);
      },
      (error) => {
        console.error('Error subscribing to cart count:', error);
        this.cartItemsCount = 0;
      }
    );
    
    // Force refresh cart count on dashboard load
    setTimeout(() => {
      this.cartService.refreshCartCount();
    }, 100);
  }

  searchBook(event: any): void {
    const searchValue = event.target.value;
    this.searchText = searchValue;
    
    if (searchValue.trim()) {
      // Use the book service to search for books
      this.bookService.searchBooks(searchValue).subscribe({
        next: (response: any) => {
          this.searchService.setSearchResults(response);
          this.dataService.SendBookDetails(searchValue);
        },
        error: (error) => {
          console.error('Search error:', error);
          this.searchService.setSearchResults([]);
        }
      });
    } else {
      // If search is empty, reset to show all books
      this.searchService.setSearchResults([]);
      this.dataService.SendBookDetails('All books');
    }
  }

  logout(): void {
    // Clear cart count on logout
    this.cartService.resetCartCount();
    localStorage.removeItem('authToken');
    this.router.navigateByUrl('login');
  }

  // Method to manually refresh cart count (useful for debugging)
  refreshCartCount(): void {
    this.cartService.refreshCartCount();
  }

  // Method to get current cart count (useful for debugging)
  getCurrentCartCount(): number {
    return this.cartService.getCurrentCartCount();
  }
}