import { Component, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { Observable, map } from 'rxjs';
import { JsonToExcelService } from '../json-to-excel.service';
import { Product } from '../interfaces/interface';

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
  excelService=inject(JsonToExcelService)

  productCount$: Observable<number> = this.firebaseService.getProducts().pipe(
    map((products)=>products.length)
  );
  productList$:Observable<Product[]>= this.firebaseService.getProducts();
  showImportPopup : boolean = false;
  
  handleSearch(value:string){
    this.firebaseService.setSearchText(value);
  }

  downloadExcel(json:Product[]){
    let response = confirm("This action will download data in a xls sheet.");
    if (response) {
      json=json.map((product:Product)=>{
        const { name, buyPrice, sellPrice, notes, id } = product;
        return { name, buyPrice, sellPrice, notes, id };
      })
      this.excelService.generateAndDownloadExcel(json,"pricelist")
    }
  }

  async importData(elem: any, productList:Product[]) {
    const file: File = elem.files[0];
    if (!file) {
      return;
    }
    let response = confirm("This will upload the data from your file to server, do you want to proceed?");
    if (response) {
      try {
        let jsonData = await this.excelService.convertToJSON(file);
        console.log(jsonData); // You can display jsonData in your template or use it as needed
        jsonData=jsonData.map((product:any)=>{
          const {NAME,BUYPRICE,SELLPRICE,NOTES,ID}= product;
          return{
            name:NAME,
            buyPrice:BUYPRICE,
            sellPrice:SELLPRICE,
            notes:NOTES,
            id:ID
          }
        })

        jsonData=this.productService.removeDuplicates(productList,jsonData)
        
        this.firebaseService.addProducts(jsonData);
        this.setShowImportPopup(false)
      } catch (error) {
        alert(`Error converting file: ${error}`);
        this.setShowImportPopup(false)
      }
    }
  }

  setShowImportPopup(value:boolean){
    this.showImportPopup = value;
  }

}
