import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/interface';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  formBuilder=inject(FormBuilder)
  productService=inject(ProductService)
  firebaseService=inject(FirebaseService)

  @Output() setFormVisibility= new EventEmitter();

  productForm=this.formBuilder.group({
    name:["",Validators.required],
    buyPrice:["",Validators.required],
    sellPrice:["",Validators.required],
    notes:[""]
  })

  handleAdd(){
    if (this.productForm.valid) {

      let formValue=this.productForm.value;
      let product={
        name:formValue.name!.toString(),
        buyPrice:Number(formValue.buyPrice),
        sellPrice:Number(formValue.sellPrice),
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
