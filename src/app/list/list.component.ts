import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/interface';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { FirebaseService } from '../firebase.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,AddProductComponent,EditProductComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  constructor(){
    this.filteredList$ = combineLatest(this.productList$,this.searchValue$).pipe(
      map(([productList,searchValue]:[Product[],string])=>{
        return productList.filter((product:Product)=>product.name.includes(searchValue))
      })
    )
  }

  productService = inject(ProductService);
  firebaseService = inject(FirebaseService);
  productList$: Observable<Product[]> = this.firebaseService.getProducts();
  searchValue$:Observable<string>= this.firebaseService.searchText;
  filteredList$:Observable<Product[]>;
  
  
  editProduct!:Product
  visibleForm=""

  deleteProduct(id:string){
    let confirmation = confirm("Are you sure you want to delete this product?");
    if (confirmation) {
      this.firebaseService.deleteProduct(id).subscribe(res=>{
        this.productService.handleDelete(id);
      })
    }
  }
  
  setEditProduct(product:Product){
    this.editProduct=product;
    this.visibleForm="edit"
  }
  
  handleFormVisibility(){
    this.visibleForm="add"
  }

  setFormVisibility(value:string){
    this.visibleForm=value;
  }
}
