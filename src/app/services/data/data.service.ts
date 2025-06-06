import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private openbook = new BehaviorSubject(['All books']);

  getbookdetails=this.openbook.asObservable();
  
  constructor() { }
  SendBookDetails(book:any){
    this.openbook.next(book);
  }
}
