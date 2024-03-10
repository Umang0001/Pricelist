import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Product } from './interfaces/interface';
import { BehaviorSubject, Observable, forkJoin, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  fireStore=inject(Firestore);
  
  productsCollection=collection(this.fireStore,'products');
  searchText:BehaviorSubject<string> = new BehaviorSubject("");
  
  getProducts():Observable<Product[]>{
    return collectionData(this.productsCollection,{
      idField:'id'
    }) as Observable<Product[]>;
  }

  addProduct(product:object): Observable<string>{
    const promise = addDoc(this.productsCollection,product).then((res)=>res.id);
    return from(promise);
  }

  deleteProduct(id:string):Observable<void>{
    const docRef = doc(this.fireStore,'products/'+ id);
    const promise = deleteDoc(docRef);
    return from(promise);
  }

  editProduct(product:Product) : Observable<void>{
    const docRef = doc(this.fireStore,'products/'+ product.id);
    const promise = setDoc(docRef,product)
    return from(promise);
  }

  setSearchText(newText:string){
    this.searchText.next(newText);
  }

  addProducts(products: Product[]): Observable<string[]> {
    const addPromises: Promise<string>[] = [];
  
    products.forEach(product => {
      const promise = addDoc(this.productsCollection, product).then(res => res.id);
      addPromises.push(promise);
    });
  
    return from(forkJoin(addPromises));
  }
}
