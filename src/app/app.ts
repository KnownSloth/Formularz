import { Component, signal, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { FormData } from '../models/form.model';
import { FormularzService } from '../services/formularz.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('Formularz zgłoszeniowy duetu');
  form: FormGroup;

  categories: string[] = [
    'I duet w wieku do lat 9',
    'II duet w wieku do lat 13',
    'III duet w wieku do lat 16',
    'IV duet w wieku do lat 19',
    'V duet w wieku do lat 26',
    'VI duet wykonujący prawykonanie w konkursie kompozytorskim'
  ];

  harpTypes: string[] = ['harfa haczykowa (celtycka)', 'harfa pedałowa'];
  scoreFiles: File[] = [];
  uploadedUrls: string[] = [];

  private fb = inject(FormBuilder);
  private formularzService = inject(FormularzService);
  private el = inject(ElementRef);
  private supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  constructor() {
    this.form = this.fb.group({
      regulationsAgreement: [false, Validators.requiredTrue],
      category: ['', Validators.required],
      harpType: ['', Validators.required],
      additionalInstrument: [''],
      performer1: this.createPerformerGroup(),
      performer2: this.createPerformerGroup(),
      programs: this.fb.array([this.createProgramGroup()]),
      consent: [false, Validators.requiredTrue]
    });
  }

  createPerformerGroup(): FormGroup {
    return this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\s*\d[\d\s-]*$/)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      birthDate: ['', Validators.required],
      teacher: ['', Validators.required],
      school: ['', Validators.required]
    });
  }

  get performer1Group(): FormGroup {
    return this.form.get('performer1') as FormGroup;
  }

  get performer2Group(): FormGroup {
    return this.form.get('performer2') as FormGroup;
  }

  get programs(): FormArray {
    return this.form.get('programs') as FormArray;
  }

  createProgramGroup(): FormGroup {
    return this.fb.group({
      composer: ['', Validators.required],
      title: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  addProgram(): void {
    this.programs.push(this.createProgramGroup());
  }

  removeProgram(index: number): void {
    if (this.programs.length > 1) {
      this.programs.removeAt(index);
    }
  }

  onScoreFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.scoreFiles = Array.from(input.files);
    }
  }

  async uploadScores(): Promise<void> {
    if (!this.scoreFiles.length) return;

    const uploaded: string[] = [];

    for (const file of this.scoreFiles) {
      const safeName = file.name.replace(/[^\w.-]/g, '_');
      const filePath = `score-files/${Date.now()}_${safeName}`;

      const { error } = await this.supabase.storage
        .from('score-files')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error.message);
        alert('Błąd podczas wysyłania plików.');
        return;
      }

      const { data: urlData } = await this.supabase.storage
        .from('score-files')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        uploaded.push(urlData.publicUrl);
      }
    }

    this.uploadedUrls = uploaded;
  }

  async onSubmit(): Promise<void> {
    this.markAllControlsAsTouched(this.form);

    if (!this.form.valid) {
      this.scrollToFirstInvalidControl();
      return;
    }

    await this.uploadScores();

    const dataToSave: FormData = {
      ...this.form.value,
      scoreFiles: this.uploadedUrls
    };

    try {
      await this.formularzService.saveForm(dataToSave);
      alert('Formularz zapisany pomyślnie!');
    } catch (err) {
      alert('Błąd: ' + err);
    }
  }

  private markAllControlsAsTouched(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllControlsAsTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  private scrollToFirstInvalidControl(): void {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      'form .ng-invalid'
    );
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidControl.focus();
    }
  }
}
