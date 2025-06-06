import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any,args: any):any[] {
    console.log(args)
    if(args=='All books'){
      return value
    }
    return value.filter((book:any)=>{
      return book.bookName.toLowerCase().includes(args);
    })
  }

}
