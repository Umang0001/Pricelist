import { Component, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  productService = inject(ProductService)
  firebaseService = inject(FirebaseService)
  productCount$: Observable<number> = this.firebaseService.getProducts().pipe(
    map((products)=>products.length)
  );
  
  handleSearch(value:string){
    this.firebaseService.setSearchText(value);
  }
}
