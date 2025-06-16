import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  allBooks: any = [];
  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private bookService: BookService
  ) { }
  cartItemsArray: any = [];
  cart: any = {};

  CustomerDetails!: FormGroup;
  addressType: string[] = ['Home', 'work', 'others'];
  count: any;
  customerDetails = false;
  address = true;
  placeOrder = true;
  summary = true;
  continue = true;
  item_qty: any;

  ngOnInit() {
    this.getAllBook();
    this.CustomerDetails = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]], // Added pattern for 10-digit mobile number
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      selectedAddressType: ['', [Validators.required]],
    });
  }

  calculateTotalPrice(): number {
    if (!this.cartItemsArray || this.cartItemsArray.length === 0) {
      return 0;
    }
    
    return this.cartItemsArray.reduce((total: number, cartItem: any) => {
      const itemTotal = (cartItem.bookModel?.price || 0) * (cartItem.quantity || 0);
      return total + itemTotal;
    }, 0);
  }

  getBookDetail(bookId: number) {
    return this.allBooks?.find((book: any) => book.bookId === bookId);
  }

  getAllBook() {
    // Get cart items
    this.cartService.getCart().subscribe(
      (response: any) => {
        console.log('Raw cartItemsArray response:', response);
        this.cart = response.data;
        if (Array.isArray(this.cart.cartItems)) {
          this.cartItemsArray = this.cart.cartItems;
        } else {
          console.error("Unexpected response format from getCart:", response);
          this.cartItemsArray = []
        }
        console.log(this.cartItemsArray)
      },
      (error) => {
        console.error('Error fetching cart:', error);
        this.snackbar.open('Error loading cart items', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      }
    );

    // Get all books for reference
    this.bookService.getAllBooks().subscribe(
      (books: any) => {
        this.allBooks = books;
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  deleteSingleBook(cartItemId: number) {
    console.log('Removing cart item with ID:', cartItemId);

    this.cartService.removeFromCart(cartItemId).subscribe(
      (response: any) => {
        console.log('Remove from cart API response:', response);
        this.getAllBook(); // Refresh cart
        this.snackbar.open('Book removed from cart', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      },
      (error) => {
        console.error('Error removing book from cart:', error);
        this.snackbar.open('Failed to remove book from cart', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      }
    );
  }

  addresssDetails() {
    this.address = false;
    this.placeOrder = false;
  }

  onContinue() {
    // Mark all fields as touched to display validation errors immediately
    this.CustomerDetails.markAllAsTouched();

    if (this.CustomerDetails.valid) {
      this.customerDetails = true; // This line seems redundant as `customerDetails` is not used to control visibility
      this.summary = false;
      this.continue = false;
      console.log('Customer Details is called', this.CustomerDetails.value);
      let data = {
        fullName: this.CustomerDetails.value.fullName,
        mobile: this.CustomerDetails.value.mobileNumber,
        address: this.CustomerDetails.value.address,
        city: this.CustomerDetails.value.city,
        state: this.CustomerDetails.value.state,
        type: this.CustomerDetails.value.selectedAddressType,
      };

      this.cartService.customersDetails(data).subscribe(
        (response: any) => {
          console.log('Customer details response:', response);
          this.snackbar.open('Customer details saved successfully', '', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
          // This part handles successful API call, if backend validation fails, you might want to adjust
          // what happens here, e.g., show an error and keep the form visible.
        },
        (error) => {
          console.error('Error saving customer details:', error);
          this.snackbar.open('Failed to save customer details', '', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
          // If backend validation fails, keep the form and `continue` button visible
          this.summary = true; // Keep summary hidden
          this.continue = true; // Keep continue button visible
        }
      );
    } else {
      this.snackbar.open('Please fill all required fields correctly', '', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
    }
  }

  increasebook(cartItem: any) {
    const newQuantity = cartItem.quantity + 1;
    console.log('Increasing quantity to:', newQuantity);
    this.updateCount(cartItem.bookModel.bookId, newQuantity);
  }

  decreasebook(cartItem: any) {
    if (cartItem.quantity <= 1) {
      this.snackbar.open('Minimum quantity is 1', '', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }

    const newQuantity = cartItem.quantity - 1;
    console.log('Decreasing quantity to:', newQuantity);
    this.updateCount(cartItem.bookModel.bookId, newQuantity);
  }

  updateCount(bookId: number, quantity: number) {
    console.log('Updating cart - BookId:', bookId, 'Quantity:', quantity);

    this.cartService.updateCart(bookId, quantity).subscribe(
      (response: any) => {
        console.log('Update cart response:', response);
        this.getAllBook(); // Refresh cart to get updated quantities
        this.snackbar.open('Cart updated successfully', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      },
      (error) => {
        console.error('Error updating cart:', error);
        this.snackbar.open('Failed to update cart', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      }
    );
  }

  confirmOrder() {
    this.cartService.placeOrder().subscribe(
      (response: any) => {
        console.log("Order placed successfully:", response);
        this.snackbar.open('Order placed successfully!', '', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        this.getAllBook(); // Refresh cart (should be empty after order)
      },
      (error) => {
        console.error("Error placing order:", error);
        this.snackbar.open('Failed to place order', '', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      }
    );
  }
}