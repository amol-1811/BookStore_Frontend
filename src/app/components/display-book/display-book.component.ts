import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { BookService } from 'src/app/services/book/book.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-display-book',
  templateUrl: './display-book.component.html',
  styleUrls: ['./display-book.component.scss']
})
export class DisplayBookComponent implements OnInit, OnChanges {
  
  @Input() bookArray: any[] = [];
  @Input() booksObject: any = {};
  @Output() pageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  Search: string = '';
  ratingCount: number = 20;
  originalPrice: number = 2000;
  pagination: boolean = true;
  p: number = 1;
  itemsPerPage: number = 8;
  totalProduct: number = 0;
  
  filteredBooks: any[] = [];

  constructor(private dataService: DataService, private router: Router, private bookService: BookService) {}

  ngOnInit(): void {
    this.subscribeToSearchData();
    this.updateFilteredBooks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookArray']) {
      this.updateFilteredBooks();
    }
  }

  subscribeToSearchData(): void {
    this.dataService.getbookdetails.subscribe({
      next: (res: any) => {
        console.log('Search data received:', res);
        
        if (typeof res === 'string') {
          this.Search = res;
        } else if (Array.isArray(res?.data)) {
          console.log('Received data is an array:', res.data);
          // If it's an array, it might be filtered books
          this.filteredBooks = res.data || [];
          this.totalProduct = res?.data.length;
          this.bookArray = res.data || [];
          return;
        }
        
        this.updateFilteredBooks();
      },
      error: (error) => {
        console.error('Error in search subscription:', error);
      }
    });
  }

  updateFilteredBooks(): void {
    if (!this.bookArray) {
      this.filteredBooks = [];
      this.totalProduct = 0;
      return;
    }

    if (!this.Search || this.Search === 'All books') {
      this.filteredBooks = [...this.bookArray];
    } else {
      this.filteredBooks = this.bookArray.filter((book: any) => {
        const searchTerm = this.Search.toLowerCase();
        const bookName = (book.bookName || '').toLowerCase();
        const author = (book.author || '').toLowerCase();
        
        return bookName.includes(searchTerm) || author.includes(searchTerm);
      });
    }
    
    this.totalProduct = this.filteredBooks.length;
  }

  onBookClick(book: any): void {
    if (book) {
      this.dataService.SendBookDetails(book);
      this.router.navigateByUrl('/dashboard/book-detail');
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
  
  resetPagination(): void {
    this.p = 1;
  }

  checkPagination(): void {
    this.pagination = this.totalProduct > 0;
  }

  // Method to get paginated books for display
  getPaginatedBooks(): any[] {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
    
    console.log(`Showing books ${startIndex + 1} to ${Math.min(endIndex, this.totalProduct)} of ${this.totalProduct}`);
    return paginatedBooks;
  }

  // Helper method to get current page info (optional - for debugging)
  getCurrentPageInfo(): string {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalProduct);
    return `${startIndex + 1}-${endIndex} of ${this.totalProduct}`;
  }
}