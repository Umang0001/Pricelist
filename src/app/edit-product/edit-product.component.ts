import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/interface';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  @Input() product!:Product
  @Output() setFormVisibility= new EventEmitter();
  formBuilder=inject(FormBuilder)
  productService=inject(ProductService)
  firebaseService=inject(FirebaseService)

  onceSubmitted : boolean = false;

  ngOnInit(){
    this.productForm.get('name')?.setValue(this.product.name)
    this.productForm.get('buyPrice')?.setValue(this.product.buyPrice.toString())
    this.productForm.get('sellPrice')?.setValue(this.product.sellPrice.toString())
    this.productForm.get('notes')?.setValue(this.product.notes)
  }
  productForm=this.formBuilder.group({
    name:["",Validators.required],
    buyPrice:[""],
    sellPrice:[""],
    notes:[""]
  })

  handleEdit(){
    this.onceSubmitted = true;
    if (this.productForm.valid) {
      let formValue=this.productForm.value;
      let product={
        id:this.product.id,
        name:formValue.name!.toString(),
        buyPrice:Number(formValue.buyPrice),
        sellPrice:Number(formValue.sellPrice),
        notes:formValue.notes!
      }
      this.firebaseService.editProduct(product).subscribe(res=>{
        this.productService.editProduct(product);
        this.closePopup()
      })
    }
  }

  closePopup(){
    this.setFormVisibility.emit("")
  }

}
