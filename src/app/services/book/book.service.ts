import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private httpService: HttpService) {}

  getAllBooks(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/api/books', headers);
  }

  // Get book by ID (Admin and User)
  getBookById(bookId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi(`/api/books/${bookId}`, headers);
  }

  // Sort books by price ascending (Admin and User)
  sortBooksByPriceAsc(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/api/books/sort-book-by-price-asc', headers);
  }

  // Sort books by price descending (Admin and User)
  sortBooksByPriceDesc(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/api/books/sort-book-by-price-desc', headers);
  }

  // Search books by author (Admin and User)
  searchBooksByAuthor(authorName: string): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi(`/api/books/search-by-author?authorName=${encodeURIComponent(authorName)}`, headers);
  }

  // Search books by book name (Admin and User)
  searchBooksByName(bookName: string): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi(`/api/books/search-by-bookname?bookName=${encodeURIComponent(bookName)}`, headers);
  }

  // General search for books (by author or book name) (Admin and User)
  searchBooks(searchTerm: string): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi(`/api/books/search-book?book=${encodeURIComponent(searchTerm)}`, headers);
  }

  // Get most recent books (Admin and User)
  getMostRecentBooks(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/api/books/recent-book', headers);
  }

  // Get paginated books (Admin and User)
  getPaginatedBooks(pageNumber: number = 1, pageSize: number = 8): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi(`/api/books/books/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`, headers);
  }

  // Helper method to handle response format consistency
  private normalizeResponse(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else if (response && response.books && Array.isArray(response.books)) {
      return response.books;
    }
    return [];
  }
}
