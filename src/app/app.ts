import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormularzService } from '../services/formularz.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('Formularz zgłoszeniowy duetu');

  categories = [
    'I duet w wieku do lat 9',
    'II duet w wieku do lat 13',
    'III duet w wieku do lat 16',
    'IV duet w wieku do lat 19',
    'V duet w wieku do lat 26',
    'VI duet wykonujący prawykonanie w konkursie kompozytorskim'
  ];

  harpTypes = [
    'harfa haczykowa (celtycka)',
    'harfa pedałowa'
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder, private formularzService: FormularzService) {
    this.form = this.fb.group({
      regulationsAgreement: [false, Validators.requiredTrue],
      category: ['', Validators.required],
      harpType: ['', Validators.required],
      additionalInstrument: [''],
      performer1: this.fb.group({
        lastName: ['', Validators.required],
        firstName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        city: [''],
        country: [''],
        birthDate: [''],
        teacher: [''],
        school: ['']
      }),
      performer2: this.fb.group({
        lastName: [''],
        firstName: [''],
        email: [''],
        phone: [''],
        city: [''],
        country: [''],
        birthDate: [''],
        teacher: [''],
        school: ['']
      }),
      program: this.fb.group({
        composer: [''],
        title: [''],
        duration: ['']
      }),
      consent: [false, Validators.requiredTrue]
    });
  }
  get consentControl() {
    return this.form.get('consent')!;
  }
  get performer1Group(): FormGroup {
    return this.form.get('performer1') as FormGroup;
  }

  get performer2Group(): FormGroup {
    return this.form.get('performer2') as FormGroup;
  }

  get programGroup(): FormGroup {
    return this.form.get('program') as FormGroup;
  }

  onSubmit() {
  if (this.form.valid) {
    this.formularzService.saveForm(this.form.value)
      .then(() => alert('Formularz zapisany pomyślnie!'))
      .catch(err => alert('Błąd: ' + err));
  } else {
    this.form.markAllAsTouched();
  }
}
}


