import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchResultsSource = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResultsSource.asObservable();

  setSearchResults(results: any[]) {
    this.searchResultsSource.next(results);
  }
}
