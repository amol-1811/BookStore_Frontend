import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsCountSubject = new BehaviorSubject<number>(0);
  public cartItemsCount$ = this.cartItemsCountSubject.asObservable();

  constructor(private httpService: HttpService) {
    this.refreshCartCount();
  }

  private updateCartCount(count: number): void {
    this.cartItemsCountSubject.next(count);
    console.log('Cart badge count updated to:', count);
  }

  refreshCartCount(): void {
    this.getCart().subscribe(
      (response: any) => {
        console.log('Refreshing cart count, response:', response);
        const cartItems = response?.data?.cartItems || [];
        const totalCount = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        this.updateCartCount(totalCount);
      },
      (error) => {
        console.error('Error refreshing cart count:', error);
        this.updateCartCount(0);
      }
    );
  }

  // Get current cart count synchronously
  getCurrentCartCount(): number {
    return this.cartItemsCountSubject.value;
  }

  // Create a new cart
  createCart(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.postApi('/api/cart', null, headers).pipe(
      tap(() => {
        // Refresh cart count after creating cart
        this.refreshCartCount();
      }),
      catchError((error) => {
        console.error('Error creating cart:', error);
        throw error;
      })
    );
  }

  // Get cart for current user
  getCart(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/get-cart', headers);
  }

  // Add book to cart
  addToCart(bookId: number, quantity: number): Observable<any> {
    const headers = this.httpService.getHeader();
    const requestBody = { bookId, quantity };
    return this.httpService.postApi('/add-to-cart', requestBody, headers).pipe(
      tap((response) => {
        console.log('Book added to cart, refreshing count');
        // Refresh cart count after successful addition
        this.refreshCartCount();
      }),
      catchError((error) => {
        console.error('Error adding to cart:', error);
        throw error;
      })
    );
  }

  // Update cart item quantity
  updateCart(bookId: number, quantity: number): Observable<any> {
    const headers = this.httpService.getHeader();
    const requestBody = { bookId, quantity };
    return this.httpService.putApi('/update-cart', requestBody, headers).pipe(
      tap((response) => {
        console.log('Cart updated, refreshing count');
        // Refresh cart count after successful update
        this.refreshCartCount();
      }),
      catchError((error) => {
        console.error('Error updating cart:', error);
        throw error;
      })
    );
  }

  // Remove item from cart
  removeFromCart(cartItemId: number): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.deleteApi(`/remove-from-cart/${cartItemId}`, headers).pipe(
      tap((response) => {
        console.log('Item removed from cart, refreshing count');
        // Refresh cart count after successful removal
        this.refreshCartCount();
      }),
      catchError((error) => {
        console.error('Error removing from cart:', error);
        throw error;
      })
    );
  }

  // Get all carts (Admin only)
  getAllCarts(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.getApi('/get-all-carts', headers);
  }

  // Update customer details
  customersDetails(reqData: any): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.postApi('/api/Customer', reqData, headers);
  }

  // Place order 
  placeOrder(): Observable<any> {
    const headers = this.httpService.getHeader();
    return this.httpService.postApi('/api/order', null, headers).pipe(
      tap((response) => {
        console.log('Order placed successfully, resetting cart count');
        // Reset cart count to 0 after successful order placement
        this.updateCartCount(0);
      }),
      catchError((error) => {
        console.error('Error placing order:', error);
        throw error;
      })
    );
  }

  setCartCount(count: number): void {
    this.updateCartCount(count);
  }

  // Method to reset cart count to 0
  resetCartCount(): void {
    this.updateCartCount(0);
  }

  // Method to increment cart count by a specific amount
  incrementCartCount(increment: number = 1): void {
    const currentCount = this.getCurrentCartCount();
    this.updateCartCount(currentCount + increment);
  }

  // Method to decrement cart count by a specific amount
  decrementCartCount(decrement: number = 1): void {
    const currentCount = this.getCurrentCartCount();
    const newCount = Math.max(0, currentCount - decrement);
    this.updateCartCount(newCount);
  }
}