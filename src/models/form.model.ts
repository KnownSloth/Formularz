export interface Performer {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  birthDate: string;
  teacher: string;
  school: string;
}

export interface Program {
  composer: string;
  title: string;
  duration: string;
}

export interface FormData {
  regulationsAgreement: boolean;
  category: string;
  harpType: string;
  additionalInstrument?: string;
  performer1: Performer;
  performer2: Performer;
  programs: Program[];
  consent: boolean;
  scoreFiles: string[];
}
