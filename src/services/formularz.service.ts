import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FormularzService {
  saveForm(data: any) {
    const db = getFirestore();
    const performer1 = data.performer1;
    const customId = `${performer1.lastName}_${performer1.firstName}_${Date.now()}`.replace(/\s+/g, '_');
    const docRef = doc(db, 'formularze', customId);
    return setDoc(docRef, data);
  }
}
