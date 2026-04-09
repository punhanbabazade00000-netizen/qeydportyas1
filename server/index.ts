import express from 'express';
import cors from 'cors';
import alasql from 'alasql';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ─── Verilənlər Bazasını hazırlayırıq ────────────────────────────────────────

alasql(`
  CREATE TABLE properties (
    registryId STRING PRIMARY KEY,
    type STRING,
    name STRING,
    lat FLOAT,
    lng FLOAT,
    address STRING,
    assignedPoliceZone STRING,
    assignedHospitalZone STRING
  )
`);

alasql(`
  CREATE TABLE citizens (
    id STRING PRIMARY KEY,
    fin STRING,
    fullName STRING,
    firstName STRING,
    lastName STRING,
    fatherName STRING,
    age INT,
    birthDate STRING,
    registrationDate STRING,
    propertyRegistryId STRING,
    apartmentNumber STRING,
    block STRING,
    status STRING,
    phone STRING,
    profession STRING,
    workplace STRING,
    gender STRING,
    maritalStatus STRING,
    isMinor BOOLEAN,
    isDisabled BOOLEAN,
    isFormerlyConvicted BOOLEAN,
    convictionReason STRING,
    visitReason STRING,
    visitDate STRING
  )
`);

alasql(`
  CREATE TABLE officers (
    id STRING PRIMARY KEY,
    propertyRegistryId STRING,
    fullName STRING,
    firstName STRING,
    lastName STRING,
    fatherName STRING,
    rank STRING,
    position STRING,
    age INT,
    gender STRING,
    maritalStatus STRING,
    phone STRING,
    email STRING,
    areaOfResponsibility STRING
  )
`);

// ─── Demo Məlumatları ─────────────────────────────────────────────────────────

alasql(`INSERT INTO properties VALUES
  ('REG-1001', 'Residential', 'Nəriman Nərimanov prospekti, 12',        40.4005, 49.8735, 'Nəriman Nərimanov prospekti, 12',        'REG-POL-1', 'REG-HOS-1'),
  ('REG-1002', 'Residential', 'Gənclik metrosu yaxınlığı, bina 45',     40.4020, 49.8750, 'Gənclik metrosu yaxınlığı, bina 45',     'REG-POL-1', 'REG-HOS-1'),
  ('REG-1003', 'Residential', 'Təbriz küçəsi, 78/A',                    40.4045, 49.8780, 'Təbriz küçəsi, 78/A',                    'REG-POL-1', 'REG-HOS-1'),
  ('REG-1004', 'Residential', 'Atatürk prospekti, 21',                  40.3985, 49.8710, 'Atatürk prospekti, 21',                  'REG-POL-1', 'REG-HOS-1'),
  ('REG-1005', 'Residential', 'Ağa Nemətulla küçəsi, 14',               40.4030, 49.8720, 'Ağa Nemətulla küçəsi, 14',               'REG-POL-1', 'REG-HOS-1'),
  ('REG-1006', 'Residential', 'Zalimxanov küçəsi, 5A',                  40.4120, 49.8800, 'Zalimxanov küçəsi, 5A',                  'REG-POL-2', 'REG-HOS-1'),
  ('REG-1007', 'Residential', 'Ziya Bunyadov küçəsi, 14',               40.4150, 49.8900, 'Ziya Bunyadov küçəsi, 14',               'REG-POL-2', 'REG-HOS-1'),
  ('REG-HOS-1', 'Hospital',   '1 saylı Şəhər Klinik Xəstəxanası',      40.3845, 49.8285, '1 saylı Şəhər Klinik Xəstəxanası',      '', ''),
  ('REG-HOS-2', 'Hospital',   'Respublika Klinik Xəstəxanası',          40.3955, 49.8055, 'Respublika Klinik Xəstəxanası',          '', ''),
  ('REG-POL-1', 'Police',     'Nərimanov Rayon Polis İdarəsi',          40.3965, 49.8635, 'Nərimanov Rayon Polis İdarəsi',          '', ''),
  ('REG-POL-2', 'Police',     '18-ci Polis Şöbəsi',                    40.4110, 49.8820, '18-ci Polis Şöbəsi',                    '', '')
`);

// Sakinlər
alasql(`INSERT INTO citizens VALUES
  ('r-REG-1001-0','5ABC123','Məmmədov Əli Həsən oğlu','Əli','Məmmədov','Həsən',35,'1989-06-15','2010-11-20','REG-1001','1','1','Active','050-123-45-67','Müəllim','Dövlət Vergi Xidməti','Kişi','Evli',false,false,false,null,null,null),
  ('r-REG-1001-1','7XYZ890','Əliyeva Səbinə Rauf qızı','Səbinə','Əliyeva','Rauf',28,'1996-03-22','2018-11-20','REG-1001','1','1','Active','055-987-65-43','Həkim','TƏBİB','Qadın','Subay',false,false,false,null,null,null),
  ('r-REG-1001-2','1QWE234','Hüseynov Cavid Səməd oğlu','Cavid','Hüseynov','Səməd',45,'1979-11-05','2005-11-20','REG-1001','2','1','Active','070-234-56-78','Mühəndis','SOCAR','Kişi','Evli',false,false,true,'Xırda xuliqanlıq',null,null),
  ('r-REG-1001-3','2RTY567','Quliyeva Leyla Orxan qızı','Leyla','Quliyeva','Orxan',52,'1972-07-18','2000-11-20','REG-1001','3','2','Active','077-345-67-89','İqtisadçı','PAŞA Bank','Qadın','Dul',false,true,false,null,null,null),
  ('r-REG-1001-4','3UIO890','Babayev Kənan Fuad oğlu','Kənan','Babayev','Fuad',14,'2010-02-28','2015-11-20','REG-1001','4','2','Active','050-456-78-90','Şagird',null,'Kişi','Subay',true,false,false,null,null,null),
  ('r-REG-1002-0','4PAS123','İbrahimov Orxan Zaur oğlu','Orxan','İbrahimov','Zaur',38,'1986-09-10','2012-11-20','REG-1002','1','1','Active','051-567-89-01','Proqramçı','Azercell','Kişi','Evli',false,false,false,null,null,null),
  ('r-REG-1002-1','5DFG456','Həsənova Aytən Vüqar qızı','Aytən','Həsənova','Vüqar',31,'1993-12-03','2019-11-20','REG-1002','2','1','Active','055-678-90-12','Dizayner','Trendyol Azerbaijan','Qadın','Subay',false,false,false,null,null,null),
  ('r-REG-1003-0','6HJK789','Vəliyev Elvin Samir oğlu','Elvin','Vəliyev','Samir',42,'1982-04-25','2008-11-20','REG-1003','1','1','Active','070-789-01-23','Bankir','Kapital Bank','Kişi','Evli',false,false,false,null,null,null),
  ('r-REG-HOS-1-0','7LMN012','Rəhimov Tural Ruslan oğlu','Tural','Rəhimov','Ruslan',67,'1957-08-12','1995-11-20','REG-HOS-1',null,null,'Active','050-890-12-34','Təqaüdçü',null,'Kişi','Dul',false,true,false,null,'Kardiologiya','2026-04-09'),
  ('r-REG-HOS-1-1','8PQR345','Mustafayeva Nigar Kamran qızı','Nigar','Mustafayeva','Kamran',55,'1969-01-20','2001-11-20','REG-HOS-1',null,null,'Active','055-901-23-45','Müəllim','Bravo Supermarket','Qadın','Evli',false,false,false,null,'Rentgen','2026-04-09')
`);

// Polis əməkdaşları
alasql(`INSERT INTO officers VALUES
  ('o-p1-farid',  'REG-POL-1', 'Qocayev Farid',    'Farid', 'Qocayev',    'Həsən',  34, 'Kişi', 'Evli',  '050-123-45-67', 'farid.q@din.gov.az',    'Zalimxanov küçəsi',  'Polis Kapitanı',          'Sahə Rəisi'),
  ('o-p1-omar',   'REG-POL-1', 'Mirzənmədov Omar', 'Omar',  'Mirzənmədov','Cavid',  29, 'Kişi', 'Subay', '055-987-65-43', 'omar.m@din.gov.az',     'Ziya Bunyadov küçəsi','Polis Baş Leytenantı',   'Sahə Rəisi'),
  ('o-p1-3',      'REG-POL-1', 'Quliyev Anar',     'Anar',  'Quliyev',    'Rəşad',  41, 'Kişi', 'Evli',  '070-111-22-33', 'anar.q@din.gov.az',     null,                 'Polis Mayoru',            'Əməliyyat müvəkkili'),
  ('o-p2-1',      'REG-POL-2', 'Paşayev Toğrul',   'Toğrul','Paşayev',    'Eldar',  36, 'Kişi', 'Evli',  '050-444-55-66', 'togrul.p@din.gov.az',   null,                 'Polis Polkovnik-leytenantı','Növbətçi müfəttiş'),
  ('o-p2-2',      'REG-POL-2', 'Abdullayev Fuad',  'Fuad',  'Abdullayev', 'Vüqar',  28, 'Kişi', 'Subay', '055-777-88-99', 'fuad.a@din.gov.az',     null,                 'Polis Leytenantı',        'Növbətçi müfəttiş')
`);


// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Converts a DB property row into the frontend Building shape */
function buildingFromRow(row: any, residents: any[], officers: any[]) {
  return {
    id: row.registryId,
    address: row.address,
    coordinates: [row.lat, row.lng] as [number, number],
    type: row.type,
    residents,
    officers: officers.length > 0 ? officers : undefined,
  };
}

function residentFromRow(r: any) {
  return {
    id: r.id,
    fin: r.fin,
    fullName: r.fullName,
    firstName: r.firstName,
    lastName: r.lastName,
    fatherName: r.fatherName,
    age: r.age,
    birthDate: r.birthDate,
    registrationDate: r.registrationDate,
    apartmentNumber: r.apartmentNumber || undefined,
    block: r.block || undefined,
    status: r.status as 'Active' | 'Inactive',
    phone: r.phone,
    profession: r.profession,
    workplace: r.workplace || undefined,
    gender: r.gender as 'Kişi' | 'Qadın',
    maritalStatus: r.maritalStatus as 'Evli' | 'Subay' | 'Dul',
    isMinor: Boolean(r.isMinor),
    isDisabled: Boolean(r.isDisabled),
    isFormerlyConvicted: Boolean(r.isFormerlyConvicted),
    convictionReason: r.convictionReason || undefined,
    visitReason: r.visitReason || undefined,
    visitDate: r.visitDate || undefined,
  };
}

function officerFromRow(o: any) {
  return {
    id: o.id,
    fullName: o.fullName,
    firstName: o.firstName,
    lastName: o.lastName,
    fatherName: o.fatherName,
    rank: o.rank,
    position: o.position,
    age: o.age,
    gender: o.gender as 'Kişi' | 'Qadın',
    maritalStatus: o.maritalStatus as 'Evli' | 'Subay' | 'Dul',
    phone: o.phone,
    email: o.email,
    areaOfResponsibility: o.areaOfResponsibility || undefined,
  };
}


// ─── API Endpoints ────────────────────────────────────────────────────────────

/** GET /api/properties — Bütün binaları frontend Building[] formatında qaytarır */
app.get('/api/properties', (_req, res) => {
  try {
    const props: any[] = alasql(`SELECT * FROM properties`);
    const result = props.map(p => {
      const residents = (alasql(`SELECT * FROM citizens WHERE propertyRegistryId = ?`, [p.registryId]) as any[]).map(residentFromRow);
      const officers  = (alasql(`SELECT * FROM officers  WHERE propertyRegistryId = ?`, [p.registryId]) as any[]).map(officerFromRow);
      return buildingFromRow(p, residents, officers);
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xətası' });
  }
});

/** GET /api/property/:registryId — Bir binanın tam məlumatlarını qaytarır */
app.get('/api/property/:registryId', (req, res) => {
  try {
    const regId = req.params.registryId;
    const prop: any = alasql(`SELECT * FROM properties WHERE registryId = ?`, [regId])[0];
    if (!prop) return res.status(404).json({ error: 'Obyekt tapılmadı' });

    const residents = (alasql(`SELECT * FROM citizens WHERE propertyRegistryId = ?`, [regId]) as any[]).map(residentFromRow);
    const officers  = (alasql(`SELECT * FROM officers  WHERE propertyRegistryId = ?`, [regId]) as any[]).map(officerFromRow);

    const police   = alasql(`SELECT * FROM properties WHERE registryId = ?`, [prop.assignedPoliceZone])[0] || null;
    const hospital = alasql(`SELECT * FROM properties WHERE registryId = ?`, [prop.assignedHospitalZone])[0] || null;

    res.json({
      building: buildingFromRow(prop, residents, officers),
      services: { police, hospital },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xətası' });
  }
});

/** POST /api/import — Bulk CSV / JSON yükləmə simulyasiyası */
app.post('/api/import', (req, res) => {
  res.json({ message: 'Məlumatlar uğurla SQL bazasına yükləndi və xəritədəki obyektlərlə (Auto-Mapping) əlaqələndirildi.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend işə düşdü: http://localhost:${PORT}`);
  console.log(`✅ API endpoints: /api/properties | /api/property/:id | /api/import`);
});
