import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { FormData } from '../models/form.model';

@Injectable({ providedIn: 'root' })
export class FormularzService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async saveForm(data: FormData): Promise<void> {
    const performer1 = data.performer1;
    const performer2 = data.performer2;

    const payload = {
      submittedAt: new Date().toISOString(),
      regulationsAgreement: data.regulationsAgreement,
      category: data.category,
      harpType: data.harpType,
      additionalInstrument: data.additionalInstrument || '',
      consent: data.consent,
      scoreFiles: data.scoreFiles || [], 
      programs: data.programs,

      performer1_lastName: performer1.lastName,
      performer1_firstName: performer1.firstName,
      performer1_email: performer1.email,
      performer1_phone: performer1.phone,
      performer1_city: performer1.city,
      performer1_country: performer1.country,
      performer1_birthDate: performer1.birthDate,
      performer1_teacher: performer1.teacher,
      performer1_school: performer1.school,

      performer2_lastName: performer2.lastName,
      performer2_firstName: performer2.firstName,
      performer2_email: performer2.email,
      performer2_phone: performer2.phone,
      performer2_city: performer2.city,
      performer2_country: performer2.country,
      performer2_birthDate: performer2.birthDate,
      performer2_teacher: performer2.teacher,
      performer2_school: performer2.school
    };

    const { error } = await this.supabase.rpc('insert_formularz', {
      payload: payload
    });

    if (error) {
      console.error('Supabase RPC insert error:', error.message);
      throw new Error(error.message);
    }
  }
}
