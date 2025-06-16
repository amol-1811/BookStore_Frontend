import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  ordered : any = [];
  Book:any;
  constructor(private orderService : OrderService){}
  ngOnInit() {
    this.getOrdersBooks();
  }

  getOrdersBooks() {
    this.orderService.getOrderDetails()?.subscribe((response: any) => {
      (this.ordered = response.data)
      console.log('Get ordered books Api is called', response);
      console.log(this.ordered);
      
    });
  }
}
