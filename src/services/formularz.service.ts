import { Injectable } from '@angular/core';
import { collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../app/app.firebase';

@Injectable({ providedIn: 'root' })
export class FormularzService {
  saveForm(data: any, customId?: string) {
    const docId = customId ?? doc(collection(firestore, 'formularze')).id;
    const docRef = doc(firestore, 'formularze', docId);
    return setDoc(docRef, data);
  }
}
