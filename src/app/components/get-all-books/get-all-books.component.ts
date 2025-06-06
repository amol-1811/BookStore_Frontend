import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book/book.service';
import { DataService } from 'src/app/services/data/data.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-get-all-books',
  templateUrl: './get-all-books.component.html',
  styleUrls: ['./get-all-books.component.scss']
})
export class GetAllBooksComponent implements OnInit {
  bookArray: any[] = [];
  filteredBooks: any[] = [];
  originalBooks: any[] = [];
  
  constructor(
    private bookService: BookService, 
    private searchService: SearchService, 
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getAllBooks();
    this.subscribeToSearchResults();
  }

  getAllBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (response: any) => {
        this.bookArray = Array.isArray(response) ? response : response.data || [];
        this.originalBooks = [...this.bookArray];
        this.bookArray.reverse();
        console.log('Books loaded:', this.bookArray);
      },
      error: (error) => {
        console.error('Error fetching books:', error);
        this.bookArray = [];
        this.originalBooks = [];
      }
    });
  }

  subscribeToSearchResults(): void {
    this.searchService.searchResults$.subscribe({
      next: (results: any[]) => {
        if (results && results.length > 0) {
          this.bookArray = results;
        } else {
          // Reset to original books if no search results
          this.bookArray = [...this.originalBooks];
        }
      },
      error: (error) => {
        console.error('Search subscription error:', error);
      }
    });
  }

  sortByHighestPrice(): void {
    this.bookArray = [...this.bookArray].sort((a: any, b: any) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      return priceB - priceA;
    });
    console.log('Sorted by highest price:', this.bookArray);
  }

  sortByLowestPrice(): void {
    this.bookArray = [...this.bookArray].sort((a: any, b: any) => {
      const priceA = a.discountPrice || a.price || 0;
      const priceB = b.discountPrice || b.price || 0;
      return priceA - priceB;
    });
    console.log('Sorted by lowest price:', this.bookArray);
  }

  sortByNewestArrival(): void {
    this.bookArray = [...this.originalBooks].reverse();
    console.log('Sorted by newest arrival:', this.bookArray);
  }

  // Method to handle sorting from template
  onSortChange(sortType: string): void {
    switch (sortType) {
      case 'price-low-high':
        this.sortByLowestPrice();
        break;
      case 'price-high-low':
        this.sortByHighestPrice();
        break;
      case 'newest':
        this.sortByNewestArrival();
        break;
      default:
        this.bookArray = [...this.originalBooks];
        break;
    }
  }

  receivemessageDisplayToGetAllBook(event: any): void {
    this.getAllBooks();
  }
}