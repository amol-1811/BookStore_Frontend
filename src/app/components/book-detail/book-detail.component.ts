import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit, OnDestroy {
  Book: any;
  addBag: boolean = false;
  count = true;
  item_qty = 1;
  comments: string = '';
  value: string = '';
  bookid: any;
  hideBadge: boolean = true;
  showCount: boolean = true;
  badgeCount: number = 1;
  isInWishlist: boolean = false; // New property to track wishlist status

  private bookDataSubscription: Subscription = new Subscription();

  feedbacks = [
    {
      userId: { fullName: 'Aniket Chile' },
      rating: 3,
      comment: `Good product. Even though the translation could have been better, Chanakya's neeti are thought provoking. Chanakya has written on many different topics and his writings are succinct.`,
    },
    {
      userId: { fullName: 'Shweta Bodkar' },
      rating: 4,
      comment: `Good product. Even though the translation could have been better, Chanakya's neeti are thought provoking. Chanakya has written on many different topics and his writings are succinct.`,
    },
  ];

  constructor(
    private dataservice: DataService,
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private wishlistService: WishlistService
  ) {
    this.hideBadge = true;
    this.badgeCount = 1;
  }

  ngOnInit(): void {
    this.bookDataSubscription = this.dataservice.getbookdetails.subscribe(
      (result: any) => {
        this.Book = result;
        console.log('Book data received:', this.Book);

        // Check if this book is already in cart and set the initial quantity
        if (this.Book?.bookId) {
          this.checkBookInCart();
          this.checkBookInWishlist(); // Check wishlist status on init
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.bookDataSubscription) {
      this.bookDataSubscription.unsubscribe();
    }
  }

  checkBookInCart(): void {
    this.cartService.getCart().subscribe(
      (response: any) => {
        console.log('Checking if book is in cart:', response);
        const cartItems = response?.data?.cartItems || [];
        const existingItem = cartItems.find(
          (item: any) =>
            item.bookId === this.Book.bookId ||
            item.bookModel?.bookId === this.Book.bookId
        );

        if (existingItem) {
          console.log('Book found in cart:', existingItem);
          this.addBag = true;
          this.count = false;
          this.item_qty = existingItem.quantity;
          this.badgeCount = existingItem.quantity;
          this.hideBadge = false;
        } else {
          console.log('Book not in cart, setting defaults');
          this.addBag = false;
          this.count = true;
          this.item_qty = 1;
          this.badgeCount = 1;
          this.hideBadge = true;
        }
      },
      (error) => {
        console.error('Error checking cart:', error);
        // Set defaults on error
        this.addBag = false;
        this.count = true;
        this.item_qty = 1;
        this.badgeCount = 1;
        this.hideBadge = true;
      }
    );
  }

  // New method to check if book is in wishlist
  checkBookInWishlist(): void {
    const bookId = this.Book?.bookId;
    if (!bookId) return;

    this.wishlistService.getWishlistBooks().subscribe(
      (response: any) => {
        console.log('Checking wishlist status:', response);
        const wishlistItems = response?.data || [];
        const existingItem = wishlistItems.find(
          (item: any) => item.bookId === bookId || item.bookModel?.bookId === bookId
        );
        
        this.isInWishlist = !!existingItem;
        console.log('Book in wishlist:', this.isInWishlist);
      },
      (error) => {
        console.error('Error checking wishlist:', error);
        this.isInWishlist = false;
      }
    );
  }

  addCarts() {
    const bookId = this.Book?.bookId;
    const quantity = this.item_qty;

    if (!bookId) {
      console.error('Book ID is missing');
      this.snackbar.open('Book ID is missing', '', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }

    console.log('Adding book to cart:', { bookId, quantity });

    this.cartService.addToCart(bookId, quantity).subscribe(
      (result: any) => {
        console.log('Book added to cart successfully:', result);
        this.addBag = true;
        this.count = false;
        this.hideBadge = false;
        this.badgeCount = quantity;

        this.snackbar.open('Book added to cart successfully', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      },
      (error) => {
        console.error('Failed to add to cart:', error);
        this.snackbar.open('Failed to add book to cart', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      }
    );
  }

  // Updated wishlist method with toggle functionality
  addWishlistBook() {
    const bookId = this.Book?.bookId;

    if (!bookId) {
      console.error('Book ID is missing');
      return;
    }

    if (this.isInWishlist) {
      // Remove from wishlist
      this.wishlistService.removeFromWishlist(bookId)?.subscribe(
        (res: any) => {
          console.log('Book removed from wishlist', res);
          this.isInWishlist = false;
          this.snackbar.open('Book Removed from Wishlist', '', {
            duration: 2000,
            verticalPosition: 'bottom',
          });
        },
        (error) => {
          console.error('Error removing from wishlist', error);
          this.snackbar.open('Failed to Remove from Wishlist', '', {
            duration: 2000,
            verticalPosition: 'bottom',
          });
        }
      );
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(bookId)?.subscribe(
        (res: any) => {
          console.log('Book added to wishlist', res);
          this.isInWishlist = true;
          this.snackbar.open('Book Added to Wishlist', '', {
            duration: 2000,
            verticalPosition: 'bottom',
          });
        },
        (error) => {
          console.error('Error adding to wishlist', error);
          this.snackbar.open('Failed to Add to Wishlist', '', {
            duration: 2000,
            verticalPosition: 'bottom',
          });
        }
      );
    }
  }

  hideshow() {
    this.showCount = false;
    this.hideBadge = true;
  }

  increment() {
    this.badgeCount++;
    this.hideBadge = false;
  }

  decrement() {
    if (this.badgeCount <= 1) {
      this.badgeCount = 1;
      return;
    }
    this.badgeCount--;
    if (this.badgeCount <= 1) {
      this.badgeCount = 1;
    }
  }

  increments(Book: any) {
    // Update local display first
    this.increment();
    this.item_qty += 1;

    console.log('Incrementing book quantity to:', this.item_qty);

    // Update cart on server
    this.updateCount(Book);
  }

  decrements(Book: any) {
    if (this.item_qty <= 1) {
      this.snackbar.open('Minimum quantity is 1', '', {
        duration: 2000,
        verticalPosition: 'bottom',
      });
      return;
    }

    // Update local display first
    this.decrement();
    this.item_qty -= 1;

    console.log('Decrementing book quantity to:', this.item_qty);

    // Update cart on server
    this.updateCount(Book);
  }

  updateCount(Book: any) {
    const bookId = Book.bookId;
    const quantity = this.item_qty;

    console.log('Updating cart count - BookId:', bookId, 'Quantity:', quantity);

    this.cartService.updateCart(bookId, quantity).subscribe(
      (response: any) => {
        console.log('Cart updated successfully:', response);

        // Show success message
        this.snackbar.open('Cart updated successfully', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      },
      (error) => {
        console.error('Failed to update cart:', error);

        // Revert local changes if API call fails
        if (this.item_qty > this.badgeCount) {
          this.item_qty--;
          this.decrement();
        } else if (this.item_qty < this.badgeCount) {
          this.item_qty++;
          this.increment();
        }

        this.snackbar.open('Failed to update cart', '', {
          duration: 2000,
          verticalPosition: 'bottom',
        });
      }
    );
  }

  getAllFeedback() {
    // Feedback functionality - currently commented out in original code
    console.log('Feedback functionality not implemented');
  }

  addFeedback() {
    let data = {
      comment: this.comments,
      rating: '2',
      bookid: this.Book.bookId,
    };
    console.log('Add feedback data:', data);
    // Feedback functionality - currently commented out in original code
  }
}