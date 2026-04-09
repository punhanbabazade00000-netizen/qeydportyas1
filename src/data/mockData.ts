import { Building, Resident, PoliceOfficer } from "../types";

const surnames = ["Əliyev", "Məmmədov", "Həsənov", "Quliyev", "İbrahimov", "Səfərov", "Paşayev", "Vəliyev", "Rəhimov", "Abdullayev", "Mustafayev", "Mehdiyev", "Quluzadə", "Babayev", "Hüseynov"];
const namesMale = ["Məmməd", "Orxan", "Kənan", "Rəşad", "Toğrul", "Anar", "Vüqar", "Elvin", "Zaur", "Fuad", "Samir", "Eldar", "Tural", "Ruslan", "Kamran"];
const namesFemale = ["Leyla", "Sevinc", "Aytən", "Nigar", "Günay", "Aysel", "Fidan", "Zəhra", "Xədicə", "Lalə", "Nərmin", "Arzu", "Səbinə", "Ülkər"];
const professions = ["Müəllim", "Həkim", "Mühəndis", "Hüquqşünas", "İqtisadçı", "Proqramçı", "Dizayner", "Satış Təmsilçisi", "Bankir", "Dövlət Qulluqçusu", "Tələbə", "Təqaüdçü"];
const maritalStatuses: ("Evli" | "Subay" | "Dul")[] = ["Evli", "Subay", "Dul"];
const workplaces = ["Azart Tuning", "SOCAR", "PAŞA Bank", "Kapital Bank", "Trendyol Azerbaijan", "Bravo Supermarket", "Azercell", "Bakcell", "Dövlət Vergi Xidməti", "TƏBİB", "Bakı Abadlıq Xidməti"];
const visitReasons = ["Təcili yardım", "Müayinə", "Cərrahiyyə", "Travma", "Kardiologiya", "Rentgen", "Analiz", "Həkim məsləhəti"];
const convictionReasons = ["Xırda xuliqanlıq", "İctimai asayişin pozulması", "Mülkiyyət əleyhinə cinayət", "Yol hərəkəti qaydalarının pozulması", "Dələduzluq"];
const policeRanks = ["Polis Polkovniki", "Polis Polkovnik-leytenantı", "Polis Mayoru", "Polis Kapitanı", "Polis Baş Leytenantı", "Polis Leytenantı", "Sıravi Polis"];

const generateRandomFIN = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let fin = "";
  for (let i = 0; i < 7; i++) {
    fin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return fin;
};

const generateRandomPhone = () => {
  const prefixes = ["050", "051", "055", "070", "077"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}-${num.toString().substring(0, 3)}-${num.toString().substring(3, 5)}-${num.toString().substring(5, 7)}`;
};

const generateResident = (id: string, aptNum: number, isHospital: boolean = false): Resident => {
  const isMale = Math.random() > 0.5;
  const name = isMale 
    ? namesMale[Math.floor(Math.random() * namesMale.length)] 
    : namesFemale[Math.floor(Math.random() * namesFemale.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const fatherName = namesMale[Math.floor(Math.random() * namesMale.length)];
  
  // Custom age logic for risk groups
  // 10% 75+, 10% minors, others random
  let age = Math.floor(18 + Math.random() * 60);
  const rand = Math.random();
  if (rand < 0.1) age = 75 + Math.floor(Math.random() * 15);
  else if (rand < 0.2) age = 3 + Math.floor(Math.random() * 14);

  const birthYear = new Date().getFullYear() - age;
  const birthMonth = 1 + Math.floor(Math.random() * 12);
  const birthDay = 1 + Math.floor(Math.random() * 28);
  
  const regYear = birthYear + Math.max(18, Math.floor(Math.random() * 10));
  
  const isConvicted = age >= 18 ? Math.random() < 0.05 : false; // 5% risk of former conviction, only for adults

  return {
    id,
    fullName: `${surname} ${name} ${fatherName} ${isMale ? "oğlu" : "qızı"}`,
    firstName: name,
    lastName: surname,
    fatherName: fatherName,
    age,
    birthDate: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
    registrationDate: `${regYear}-11-20`,
    apartmentNumber: isHospital ? undefined : aptNum.toString(),
    status: Math.random() > 0.1 ? "Active" : "Inactive",
    fin: generateRandomFIN(),
    phone: generateRandomPhone(),
    profession: age >= 65 ? "Təqaüdçü" : (age < 18 ? "Şagird" : (isHospital ? "Yoxdur" : professions[Math.floor(Math.random() * professions.length)])),
    workplace: age >= 65 || age < 18 ? undefined : workplaces[Math.floor(Math.random() * workplaces.length)],
    gender: isMale ? "Kişi" : "Qadın",
    maritalStatus: age < 18 ? "Subay" : maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
    visitReason: isHospital ? visitReasons[Math.floor(Math.random() * visitReasons.length)] : undefined,
    visitDate: isHospital ? new Date().toISOString().split('T')[0] : undefined,
    isDisabled: Math.random() < 0.08, // 8% disability risk
    isFormerlyConvicted: isConvicted,
    convictionReason: isConvicted ? convictionReasons[Math.floor(Math.random() * convictionReasons.length)] : undefined,
    isMinor: age < 18
  };
};

const generatePoliceOfficer = (id: string): PoliceOfficer => {
  const name = namesMale[Math.floor(Math.random() * namesMale.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const fatherName = namesMale[Math.floor(Math.random() * namesMale.length)];
  const email = `${name.toLowerCase()}.${surname.toLowerCase()}@gmail.com`;
  const rank = policeRanks[Math.floor(Math.random() * policeRanks.length)];
  const position = Math.random() > 0.5 ? "Əməliyyat müvəkkili" : "Növbətçi müfəttiş";
  return {
    id,
    fullName: `${surname} ${name}`,
    firstName: name,
    lastName: surname,
    fatherName: fatherName,
    rank,
    position,
    age: 22 + Math.floor(Math.random() * 35),
    gender: "Kişi",
    maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
    phone: generateRandomPhone(),
    email,
    areaOfResponsibility: undefined
  };
};

const buildingsData: Omit<Building, "residents">[] = [
  { id: "b1", address: "Nəriman Nərimanov prospekti, 12", coordinates: [40.4005, 49.8735], type: "Residential" },
  { id: "b2", address: "Gənclik metrosu yaxınlığı, bina 45", coordinates: [40.4020, 49.8750], type: "Residential" },
  { id: "b3", address: "Təbriz küçəsi, 78/A", coordinates: [40.4045, 49.8780], type: "Residential" },
  { id: "b4", address: "Atatürk prospekti, 21", coordinates: [40.3985, 49.8710], type: "Residential" },
  { id: "b5", address: "Ağa Nemətulla küçəsi, 14", coordinates: [40.4030, 49.8720], type: "Residential" },
  // Specific areas for Area Chiefs
  { id: "b6", address: "Zalimxanov kucesi, 5A", coordinates: [40.4120, 49.8800], type: "Residential" },
  { id: "b7", address: "Ziya Bunyadov kucesi, 14", coordinates: [40.4150, 49.8900], type: "Residential" },
  // Hospitals
  { id: "h1", address: "1 saylı Şəhər Klinik Xəstəxanası (Semaşko)", coordinates: [40.3845, 49.8285], type: "Hospital" },
  { id: "h2", address: "Respublika Klinik Xəstəxanası", coordinates: [40.3955, 49.8055], type: "Hospital" },
  // Police Stations
  { id: "p1", address: "Nərimanov Rayon Polis İdarəsi", coordinates: [40.3965, 49.8635], type: "Police" },
  { id: "p2", address: "18-ci Polis Şöbəsi", coordinates: [40.4110, 49.8820], type: "Police" },
];

export const mockBuildings: Building[] = buildingsData.map((b, bIdx) => {
  const residentCount = b.type === "Hospital" ? 10 : (b.type === "Police" ? 0 : 20);
  const residents: Resident[] = [];
  for (let i = 0; i < residentCount; i++) {
    const blockNum = (Math.floor(i / 10) % 4) + 1; // 4 blocks, 10 residents each
    const aptNum = (i % 20) + 1;
    const resident = generateResident(`r-${b.id}-${i}`, aptNum, b.type === "Hospital");
    resident.block = blockNum.toString();
    residents.push(resident);
  }

  let officers = b.type === "Police" ? [
    generatePoliceOfficer(`o-${b.id}-1`),
    generatePoliceOfficer(`o-${b.id}-2`),
    generatePoliceOfficer(`o-${b.id}-3`),
    generatePoliceOfficer(`o-${b.id}-4`),
    generatePoliceOfficer(`o-${b.id}-5`),
  ] : undefined;

  if (b.id === "p1" && officers) {
    officers = [
      { 
        id: "o-p1-farid", 
        fullName: "Qocayev Farid", 
        firstName: "Farid",
        lastName: "Qocayev",
        fatherName: "Həsən",
        rank: "Polis Kapitanı", 
        position: "Sahə Rəisi",
        age: 34,
        gender: "Kişi",
        maritalStatus: "Evli",
        phone: "050-123-45-67", 
        email: "farid.q@din.gov.az", 
        areaOfResponsibility: "Zalimxanov kucesi" 
      },
      { 
        id: "o-p1-omar", 
        fullName: "Mirzanmadov Omar", 
        firstName: "Omar",
        lastName: "Mirzənmədov",
        fatherName: "Cavid",
        rank: "Polis Baş Leytenantı", 
        position: "Sahə Rəisi",
        age: 29,
        gender: "Kişi",
        maritalStatus: "Subay",
        phone: "055-987-65-43", 
        email: "omar.m@din.gov.az", 
        areaOfResponsibility: "Ziya Bunyadov kucesi" 
      },
      ...officers
    ];
  }

  return { ...b, residents, officers };
});
