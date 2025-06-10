import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from 'src/app/services/book/book.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  constructor(private wishlistService: WishlistService , private snackbar : MatSnackBar,private bookService :BookService) {}
  wishlist : any = [];
  allBooks : any = [];
  Book:any;
  ngOnInit() {
    this.getWishlistBooks();
  }

  getWishlistBooks() {
    this.wishlistService.getWishlistBooks()?.subscribe((response: any) => {
      (this.wishlist = response.data)
      console.log('Get Wishlist Api is called', response);
      console.log(this.wishlist);
    });
     this.bookService.getAllBooks().subscribe((books: any) => {
    this.allBooks = books;
      
  });
  }
  
  deletewishListBooks(reqData:number){
    console.log(reqData);
    this.wishlistService.removeFromWishlist(reqData)?.subscribe((response:any)=>{
      this.getWishlistBooks()
      console.log('delete Api is Called', response);
    })
    this.snackbar.open('WishList Book Removed' ,'',{
      duration:2000,
      verticalPosition:'bottom'
    })
  }
}
