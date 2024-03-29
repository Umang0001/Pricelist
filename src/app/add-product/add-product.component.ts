import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/interface';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  formBuilder=inject(FormBuilder)
  productService=inject(ProductService)
  firebaseService=inject(FirebaseService)

  @Output() setFormVisibility= new EventEmitter();

  onceSubmitted : boolean = false;

  productForm=this.formBuilder.nonNullable.group({
    name:["",Validators.required],
    buyPrice:[""],
    sellPrice:[""],
    notes:[""]
  })

  handleAdd(){
    this.onceSubmitted = true
    if (this.productForm.valid) {

      let formValue=this.productForm.getRawValue();
      let product={
        name:formValue.name!.toString(),
        buyPrice: formValue.buyPrice,
        sellPrice: formValue.sellPrice,
        notes:formValue.notes!
      }
      this.firebaseService.addProduct(product).subscribe((id:string)=>{
        this.productService.addProduct({...product,id});
        this.closePopup()
      })
    }
  }

  closePopup(){
    this.setFormVisibility.emit("")
  }
}
