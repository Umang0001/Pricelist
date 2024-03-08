import { Injectable, signal } from '@angular/core';
import { Product } from './interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() {}

  productList = signal<Product[]>([])

  addProduct(product:Product){
    
    const newList = [...this.productList(),product];
    this.productList.set(newList)
    console.log(this.productList(),"prod");
  }

  handleDelete(id:string){
    const newList = this.productList().filter((product:Product)=>product.id !== id);
    this.productList.set(newList)
  }

  editProduct(editedProduct:Product){
    const newList =this.productList().map((product:Product)=>{
      if (editedProduct.id=== product.id) {
        return{
          ...editedProduct
        }
      }
      return product
    })
    this.productList.set(newList)
  }

  searchProduct(value:string){
    
  }

    
}
