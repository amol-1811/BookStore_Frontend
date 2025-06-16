import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private httpService: HttpService) {}

  placeOrderFromCart(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.postApi('/api/order', {}, headers);
  }

  getOrderDetails(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/api/order/get-order-details', headers);
  }
}