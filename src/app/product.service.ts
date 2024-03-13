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

   removeDuplicates(array1:Product[], array2:Product[]) {
    // Create a set to store unique IDs from the first array
    const idSet = new Set(array1.map(obj => obj.id));
    
    // Filter out objects from the second array whose IDs are not present in the set
    const uniqueElements = array2.filter(obj => !idSet.has(obj.id));
    
    return uniqueElements;
}

    
}
