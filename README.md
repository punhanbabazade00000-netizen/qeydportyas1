# Qeydiyyat Portalı (Yaşayış Qeydiyyatı Portalı)

Bu layihə Azərbaycan Respublikası E-Dövlət sisteminin tərkib hissəsi olan Yaşayış Qeydiyyatı Portalının simulyasiyasıdır. Layihə həm frontend (React + Vite), həm də backend (Express + SQL) hissələrdən ibarətdir.

## Əsas Funksionallıqlar

- **İnteqrasiya olunmuş Xəritə:** Binaların, xəstəxanaların və polis şöbələrinin xəritədə vizuallaşdırılması.
- **Real-vaxt Data:** Backend API vasitəsilə sakinlərin və binaların məlumatlarının idarə olunması.
- **Yeni Qeydiyyat Sistemi:** Vətəndaşların qeydiyyatı üçün addımlı forma (Şəxsi məlumatlar + GPS/Xəritə seçimi ilə ünvan).
- **Dashboard:** Statistik məlumatlar, sakin siyahıları və hesabatların idarə olunması.
- **Chat Dəstəyi:** Operativ xidməti dəstək üçün bot interfeysi.

## Necə işə salmalı?

### Müstəqil şəkildə işə salmaq üçün:

**1. Asılılıqları yükləyin:**
```bash
npm install
```

**2. Backend serveri başladın (Port 4000):**
```bash
node node_modules/tsx/dist/cli.cjs server/index.ts
```

**3. Frontend serveri başladın (Port 3000):**
```bash
node node_modules/vite/bin/vite.js --port=3000
```

### Avtomatik işə salmaq üçün (Sistem icazə verirsə):
```bash
npm run dev:full
```

## Texnologiyalar

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Leaflet, Motion.
- **Backend:** Express, AlaSQL (In-memory SQL), TSX.

## Müəllif
[Punhan Babazadə](https://github.com/punhanbabazade00000-netizen)
