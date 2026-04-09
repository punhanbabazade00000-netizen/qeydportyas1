import React, { useState, useCallback, useRef } from "react";
import {
  Lock, User, ShieldCheck, ArrowRight, X, MapPin, Navigation,
  CheckCircle2, ChevronRight, Loader2, AlertCircle, UserPlus,
  Phone, Briefcase, Calendar, Users, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Custom map pin icon ───────────────────────────────────────────────────────
const PIN_ICON = L.divIcon({
  html: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2C12.48 2 8 6.48 8 12C8 20.25 18 34 18 34C18 34 28 20.25 28 12C28 6.48 23.52 2 18 2Z" fill="#2563eb" stroke="white" stroke-width="2"/>
    <circle cx="18" cy="12" r="4.5" fill="white"/>
  </svg>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// ── Map click handler ─────────────────────────────────────────────────────────
const MapClickHandler = ({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
};

// ── Registration modal ────────────────────────────────────────────────────────
interface RegModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "info" | "location" | "done";

const PROFESSIONS = [
  "Müəllim", "Həkim", "Mühəndis", "Hüquqşünas", "İqtisadçı",
  "Proqramçı", "Satış Təmsilçisi", "Bankir", "Dövlət Qulluqçusu",
  "Tələbə", "Təqaüdçü", "Digər",
];

const RegistrationModal: React.FC<RegModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>("info");

  // ── Form state ──────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [fin, setFin]             = useState("");
  const [phone, setPhone]         = useState("");
  const [birth, setBirth]         = useState("");
  const [gender, setGender]       = useState<"Kişi" | "Qadın">("Kişi");
  const [profession, setProfession] = useState(PROFESSIONS[0]);

  // ── Location state ──────────────────────────────────────────────────────────
  const [coords, setCoords]       = useState<[number, number] | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError]   = useState("");
  const [locMode, setLocMode]     = useState<"map" | "gps">("map");

  // ── Form errors ─────────────────────────────────────────────────────────────
  const [formError, setFormError] = useState("");
  const [saving, setSaving]       = useState(false);

  // ── Step 1 → 2 validation ───────────────────────────────────────────────────
  const goToLocation = () => {
    if (!firstName.trim() || !lastName.trim() || !fin.trim() || !phone.trim() || !birth) {
      setFormError("Bütün sahələri doldurun.");
      return;
    }
    if (fin.length !== 7) {
      setFormError("FİN kodu 7 simvol olmalıdır.");
      return;
    }
    setFormError("");
    setStep("location");
  };

  // ── GPS detection ───────────────────────────────────────────────────────────
  const detectGPS = () => {
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setGpsLoading(false);
      },
      () => {
        setGpsError("GPS məlumatı alına bilmədi. Xəritədən əl ilə seçin.");
        setGpsLoading(false);
        setLocMode("map");
      },
      { timeout: 8000 }
    );
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const submit = () => {
    if (!coords) { setGpsError("Yer seçilməyib."); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setStep("done");
    }, 1400);
  };

  // ── Map center ───────────────────────────────────────────────────────────────
  const defaultCenter: [number, number] = coords ?? [40.4093, 49.8671];

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.93, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.93, y: 24, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003366] to-blue-700 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-none">Yeni Qeydiyyat</h2>
              <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                {step === "info" ? "Şəxsi Məlumatlar" : step === "location" ? "Ünvan & Məkan" : "Tamamlandı"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-5 pb-1 gap-2 shrink-0">
          {(["info", "location", "done"] as Step[]).map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                step === "done" || (step === "location" && i <= 1) || (step === "info" && i === 0)
                  ? "bg-blue-600"
                  : "bg-gray-100"
              }`} />
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Personal Info ── */}
            {step === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Last name */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Soyadı
                    </label>
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Əliyev"
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                  {/* First name */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Adı
                    </label>
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Orxan"
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>

                {/* FIN */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <CreditCard className="w-3 h-3" /> FİN Kodu (Şəxsiyyət vəsiqəsindən)
                  </label>
                  <input
                    value={fin}
                    onChange={e => setFin(e.target.value.toUpperCase().slice(0, 7))}
                    placeholder="5ABC123"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all tracking-widest"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Mobil Nömrə
                    </label>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="050-000-00-00"
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                  {/* Birth */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Doğum Tarixi
                    </label>
                    <input
                      type="date"
                      value={birth}
                      onChange={e => setBirth(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> Cins
                    </label>
                    <div className="flex rounded-2xl overflow-hidden border border-gray-100">
                      {(["Kişi", "Qadın"] as const).map(g => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`flex-1 py-3.5 text-xs font-black transition-all ${gender === g ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Profession */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> Peşə
                    </label>
                    <select
                      value={profession}
                      onChange={e => setProfession(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    >
                      {PROFESSIONS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />{formError}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Step 2: Location ── */}
            {step === "location" && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="p-6 space-y-4"
              >
                <p className="text-xs font-bold text-gray-500 leading-relaxed">
                  Yaşadığınız binanın yerini aşağıdakı üsullardan biri ilə qeyd edin:
                </p>

                {/* Mode tabs */}
                <div className="flex rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <button
                    onClick={() => setLocMode("map")}
                    className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-2 transition-all ${locMode === "map" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <MapPin className="w-4 h-4" /> Xəritədə seç
                  </button>
                  <button
                    onClick={() => { setLocMode("gps"); detectGPS(); }}
                    className={`flex-1 py-3 text-xs font-black flex items-center justify-center gap-2 transition-all ${locMode === "gps" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Navigation className="w-4 h-4" /> GPS ilə tap
                  </button>
                </div>

                {/* GPS status */}
                {locMode === "gps" && (
                  <div className={`flex items-center gap-3 p-3 rounded-2xl text-xs font-bold ${gpsLoading ? "bg-blue-50 text-blue-600" : gpsError ? "bg-red-50 text-red-600 border border-red-100" : coords ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-500"}`}>
                    {gpsLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin shrink-0" /> GPS mövqeyi axtarılır...</>
                    ) : gpsError ? (
                      <><AlertCircle className="w-4 h-4 shrink-0" />{gpsError}</>
                    ) : coords ? (
                      <><CheckCircle2 className="w-4 h-4 shrink-0" /> Mövqe tapıldı: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}</>
                    ) : null}
                  </div>
                )}

                {/* Map */}
                <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-inner" style={{ height: 280 }}>
                  <MapContainer
                    key={defaultCenter.join(",")}
                    center={defaultCenter}
                    zoom={coords ? 16 : 13}
                    zoomControl
                    scrollWheelZoom
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locMode === "map" && (
                      <MapClickHandler onPick={(lat, lng) => setCoords([lat, lng])} />
                    )}
                    {coords && <Marker position={coords} icon={PIN_ICON} />}
                  </MapContainer>
                </div>

                {/* Coords display */}
                {coords ? (
                  <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-2xl">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Seçilmiş Koordinatlar</p>
                      <p className="text-sm font-black text-blue-800">{coords[0].toFixed(6)}, {coords[1].toFixed(6)}</p>
                    </div>
                    <button
                      onClick={() => setCoords(null)}
                      className="ml-auto text-[9px] font-black text-blue-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-[10px] text-gray-400 font-bold">
                    {locMode === "map" ? "📍 Binanızın yerini seçmək üçün xəritəyə klikləyin" : "GPS aktiv deyil — xəritə rejiminə keçin"}
                  </p>
                )}

                {gpsError === "" && !coords && locMode === "gps" && !gpsLoading && null}
              </motion.div>
            )}

            {/* ── Step 3: Success ── */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center text-center space-y-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, damping: 12 }}
                  className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center border-2 border-green-100"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Qeydiyyat Tamamlandı!</h3>
                  <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed max-w-xs">
                    <strong>{lastName} {firstName}</strong>, müraciətiniz qeydə alındı.<br />
                    Məlumatlarınız yoxlandıqdan sonra sizə bildiriş göndəriləcək.
                  </p>
                </div>
                <div className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-left">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qeydiyyat Məlumatları</p>
                  <div className="grid grid-cols-2 gap-1 text-xs font-bold text-gray-700">
                    <span className="text-gray-400">Ad Soyad:</span><span>{lastName} {firstName}</span>
                    <span className="text-gray-400">FİN:</span><span>{fin}</span>
                    <span className="text-gray-400">Telefon:</span><span>{phone}</span>
                    <span className="text-gray-400">Koordinat:</span>
                    <span>{coords ? `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}` : "—"}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-[#003366] text-white rounded-3xl font-black text-sm hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20"
                >
                  Bağla
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        {step !== "done" && (
          <div className="p-6 border-t border-gray-50 bg-white shrink-0 flex gap-3">
            {step === "location" && (
              <button
                onClick={() => setStep("info")}
                className="flex-1 py-4 rounded-3xl border-2 border-gray-100 text-gray-500 font-black text-sm hover:bg-gray-50 transition-all"
              >
                ← Geri
              </button>
            )}
            <button
              onClick={step === "info" ? goToLocation : submit}
              disabled={saving || (step === "location" && !coords)}
              className="flex-1 py-4 bg-blue-600 text-white rounded-3xl font-black text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Göndərilir...</>
              ) : step === "info" ? (
                <>Davam Et <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Qeydiyyatı Tamamla <CheckCircle2 className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  Main Login Component
// ═══════════════════════════════════════════════════════════════════════════════
interface LoginProps {
  onLogin: (name: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [regSuccess, setRegSuccess]     = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        onLogin("Sistem Administratoru (Full Access)");
      } else if (username === "farid" && password === "farid123") {
        onLogin("Qocayev Farid");
      } else if (username === "omar" && password === "omar123") {
        onLogin("Mirzanmadov Omar");
      } else if (username === "vetendas" && password === "123") {
        onLogin("Məmmədov Əli (Vətəndaş)");
      } else {
        setError("İstifadəçi adı və ya şifrə yanlışdır.");
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-black">
          <img
            src="/src/assets/din_logo.png"
            alt="DİN Background"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/40 via-transparent to-black/60 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative w-full max-w-md p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-600/30 mb-6 group transition-transform hover:rotate-12 duration-500">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">E-Dövlət</h2>
            <p className="text-blue-200/60 text-sm font-bold uppercase tracking-[0.3em]">Yaşayış Qeydiyyatı Portalı</p>
          </div>

          {/* Registration success toast */}
          <AnimatePresence>
            {regSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Qeydiyyat sorğunuz göndərildi. Sistem aktiv edildikdən sonra giriş edə bilərsiniz.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest ml-1">İstifadəçi Adı</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/30 group-focus-within:text-blue-400 transition-colors" />
                <input
                  autoFocus
                  required
                  type="text"
                  placeholder="İstifadəçi adı..."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-blue-200/20 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest ml-1">Şifrə</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/30 group-focus-within:text-blue-400 transition-colors" />
                <input
                  required
                  type="password"
                  placeholder="Şifrəniz..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-blue-200/20 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={isLoading || !username || !password}
              type="submit"
              className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-sm hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-blue-600/30 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Yoxlanılır...</>
              ) : (
                <>Sistemə Giriş <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* ── Register link ── */}
          <div className="mt-6 text-center">
            <button
              onClick={() => { setShowRegister(true); setRegSuccess(false); }}
              className="group inline-flex items-center gap-2 text-blue-300/60 hover:text-blue-300 text-xs font-black uppercase tracking-widest transition-all duration-300"
            >
              <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
              Qeydiyyat
              <ChevronRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[9px] text-blue-200/20 font-bold mt-1.5 uppercase tracking-wider">
              İlk dəfə sistemi istifadə edirsinizsə
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 text-center bg-white/5 p-4 rounded-3xl border border-white/5">
            <p className="text-[10px] text-blue-200/30 font-bold uppercase tracking-widest leading-relaxed">
              DİQQƏT: Bu portal yalnız səlahiyyətli şəxslər tərəfindən xidməti istifadə üçün nəzərdə tutulub.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegister && (
          <RegistrationModal
            onClose={() => setShowRegister(false)}
            onSuccess={() => {
              setShowRegister(false);
              setRegSuccess(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
