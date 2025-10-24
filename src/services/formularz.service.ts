import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FormularzService {

  saveForm(data: any) {
    const db = getFirestore();

    const timestamp = new Date().getTime(); 
    const lastName = data.performer1.lastName.replace(/\s+/g, '_'); 
    const firstName = data.performer1.firstName.replace(/\s+/g, '_');
    const docId = `${lastName}_${firstName}_${timestamp}`;

    const docRef = doc(db, 'formularze', docId);
    return setDoc(docRef, data);
  }
}
