import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FormularzService {
  constructor(private firestore: Firestore) {} 

  saveForm(data: any) {
    const formularzeRef = collection(this.firestore, 'formularze');
    return addDoc(formularzeRef, data);
  }
}