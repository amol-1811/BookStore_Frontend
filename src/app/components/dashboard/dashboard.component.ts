import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';
import { DataService } from 'src/app/services/data/data.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchText: string = '';
  userName: string = 'Amol';
  cartItemsCount: number = 0;
  cartBook: any[] = [];

  constructor(
    private searchService: SearchService, 
    private bookService: BookService, 
    private dataService: DataService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllCartItems();
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
    localStorage.removeItem('authToken');
    this.router.navigateByUrl('login');
  }

  getAllCartItems(): void {
    // Since cart service is commented out, we'll simulate cart count
    // Replace this with actual cart service call when available
    try {
      const cartData = localStorage.getItem('cartItems');
      if (cartData) {
        this.cartBook = JSON.parse(cartData);
        this.cartItemsCount = this.cartBook.length;
      } else {
        this.cartBook = [];
        this.cartItemsCount = 0;
      }
    } catch (error) {
      console.error('Error getting cart items:', error);
      this.cartBook = [];
      this.cartItemsCount = 0;
    }
  }
}