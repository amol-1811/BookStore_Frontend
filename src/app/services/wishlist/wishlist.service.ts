import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  constructor(private httpService: HttpService) {}

  addToWishlist(bookId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.postApi(`/api/wishlist/${bookId}`, {}, headers);
  }

  getWishlistBooks(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/get-wishlist', headers);
  }

  removeFromWishlist(bookId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.deleteApi(`/api/wishlist/${bookId}`, headers);
  }
}