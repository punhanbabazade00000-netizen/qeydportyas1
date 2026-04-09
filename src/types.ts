export interface Resident {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  birthDate: string;
  registrationDate: string;
  apartmentNumber?: string;
  block?: string;
  status: "Active" | "Inactive";
  fin: string;
  phone: string;
  profession: string;
  workplace?: string;
  gender: "Kişi" | "Qadın";
  maritalStatus: "Evli" | "Subay" | "Dul";
  visitReason?: string;
  visitDate?: string;
  // Risk Group Fields
  age: number;
  isDisabled?: boolean;
  isFormerlyConvicted?: boolean;
  convictionReason?: string;
  isMinor?: boolean;
}

export interface PoliceOfficer {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  rank: string;
  position: string;
  age?: number;
  gender?: "Kişi" | "Qadın";
  maritalStatus?: "Evli" | "Subay" | "Dul";
  phone: string;
  email: string;
  areaOfResponsibility?: string;
}

export interface Building {
  id: string;
  address: string;
  coordinates: [number, number];
  residents: Resident[];
  type: "Residential" | "Hospital" | "Police"; // New: Building type
  officers?: PoliceOfficer[]; // Only for Police type
}
