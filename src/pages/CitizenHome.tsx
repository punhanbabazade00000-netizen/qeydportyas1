import React, { useState } from "react";
import { User, MapPin, Shield, Activity, Phone, Clock, FileText, CheckCircle2, X, Send, Download, Calendar, FileBadge } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const CitizenHome: React.FC = () => {
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  
  const [complaintText, setComplaintText] = useState("");
  const [subject, setSubject] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !complaintText) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Ərizəniz 18-ci Polis Bölməsinin bazasına əlavə edildi.");
      setShowSuccess(true);
      setTimeout(() => {
        setIsComplaintModalOpen(false);
        setShowSuccess(false);
        setSubject("");
        setComplaintText("");
      }, 2000);
    }, 1500);
  };

  const handleBookDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDate) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Həkim qəbulunuz uğurla təsdiqləndi.");
      setShowSuccess(true);
      setTimeout(() => {
        setIsDoctorModalOpen(false);
        setShowSuccess(false);
        setAppointmentDate("");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col p-6 overflow-y-auto relative">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #pdf-body, #pdf-body * { visibility: visible; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          #pdf-body { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 40px; box-shadow: none !important; background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Welcome Section */}
        <div className="bg-[#003366] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex gap-6 items-center">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wider">Məmmədov Əli Həsən oğlu</h2>
              <div className="flex gap-4 mt-2 text-blue-200 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> FİN: 5ABC123</span>
                <span className="flex items-center gap-1.5 text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> Aktiv Qeydiyyat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Address Registration */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">RƏSMİ QEYDİYYAT ÜNVANI</h3>
            <p className="text-lg font-bold text-[#003366] mb-4">Bakı ş., Nərimanov r-nu, Əhməd Rəcəbli küç., Bina 15, Mənzil 42</p>
            
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex justify-between">
                <span>Qeydiyyat tarixi:</span> <span className="text-gray-900">12.05.2018</span>
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex justify-between">
                <span>Birgə qeydiyyatda olanlar:</span> <span className="text-gray-900">3 nəfər (Ailə üzvü)</span>
              </p>
              <button 
                onClick={() => setIsPropertyModalOpen(true)}
                className="w-full mt-2 py-2 border-2 border-blue-600 border-dashed text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors"
              >
                Mülkiyyət Çıxarışına bax (PDF)
              </button>
            </div>
          </motion.div>

          {/* Local Police Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">XİDMƏTİ POLİS ŞÖBƏSİ VƏ SAHƏ RƏİSİ</h3>
            <p className="text-lg font-bold text-[#003366] mb-4">Nərimanov Rİ, 18-ci Polis Bölməsi</p>
            
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
              <p className="text-sm font-bold text-gray-900 flex justify-between items-center mb-1">
                Polis Kapitanı, Rüstəmov Elnur
                <span className="text-[9px] bg-emerald-600 text-white px-2 py-1 rounded-full uppercase tracking-widest">Sahə mütəvəkkili</span>
              </p>
              <div className="space-y-2 mt-3 text-xs font-bold text-gray-600">
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Aşıq Molla Cümə küç. 12</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-500" /> +994 50 123 45 67 (Xidməti)</p>
                <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Qəbul günləri: Çərşənbə (10:00 - 14:00)</p>
              </div>
              <button 
                onClick={() => setIsComplaintModalOpen(true)}
                className="w-full mt-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                Şikayət / Ərizə göndər
              </button>
            </div>
          </motion.div>

          {/* Local Health / Doctor Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all lg:col-span-2">
            <div className="absolute top-4 right-4 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">XİDMƏT EDƏN TİBB MÜƏSSİSƏSİ VƏ SAHƏ HƏKİMİ</h3>
            <p className="text-lg font-bold text-[#003366] mb-4">Nərimanov r-nu, 4 Saylı Şəhər Poliklinikası</p>
            
            <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100 flex flex-col md:flex-row gap-6">
              <div className="flex-1 border-b md:border-b-0 md:border-r border-red-100 pb-4 md:pb-0 md:pr-4">
                <p className="text-sm font-bold text-gray-900 mb-1">Dr. Səmədova Aytən</p>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Ailə həkimi (Sahə Terapevti)</p>
                <div className="space-y-2 text-xs font-bold text-gray-600">
                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-red-400" /> Ağa Nemətulla küç. 44</p>
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-red-400" /> +994 12 555 12 34</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">Cari Növbətçi Həkimlər <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[8px] animate-pulse">CANLI</span></p>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-2">🩺 Dr. Qafarova R. <span className="text-[9px] text-gray-400 font-normal border border-gray-200 px-1 rounded">Pediatr</span></p>
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-2">🫀 Dr. Əliyev M. <span className="text-[9px] text-gray-400 font-normal border border-gray-200 px-1 rounded">Kardioloq</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDoctorModalOpen(true)}
                  className="w-full mt-4 py-3 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-red-600 hover:bg-red-50 transition-colors shadow-sm"
                 >
                   E-Təbib vasitəsilə Həkim Qəbulu
                 </button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Complaint Modal */}
      <AnimatePresence>
        {isComplaintModalOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsComplaintModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-emerald-100"
            >
              {showSuccess ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Uğurla Göndərildi!</h2>
                  <p className="text-sm text-gray-500 font-bold">{successMessage}</p>
                </div>
              ) : (
                <>
                  <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                    <div>
                      <h2 className="font-black uppercase tracking-widest flex items-center gap-3">
                        Rəsmi Ərizə Forması
                      </h2>
                      <p className="text-[10px] text-emerald-200 font-bold mt-1 uppercase tracking-widest">Nərimanov Rİ, 18-ci Polis Bölməsi</p>
                    </div>
                    <button onClick={() => setIsComplaintModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSendComplaint} className="p-6 space-y-5">
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3 text-sm font-bold text-gray-700">
                      <span className="text-emerald-600 font-black">Kimə:</span> 
                      Polis Kapitanı, Rüstəmov Elnur (Sahə rəisi)
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Mövzu (Təsnifat)</label>
                      <select 
                        required
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="" disabled>Seçim edin...</option>
                        <option value="şikayət">İctimai asayişin pozulması (Şikayət)</option>
                        <option value="qeydiyyat">Yaşayış yeri üzrə qeydiyyat / dəyişiklik</option>
                        <option value="məlumat">Şübhəli şəxs və ya hadisə barədə məlumat</option>
                        <option value="digər">Digər məsələ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Məzmun (Detaili Təsvir)</label>
                      <textarea 
                        required
                        value={complaintText}
                        onChange={e => setComplaintText(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none h-32"
                        placeholder="Müraciətinizin mətnini buraya daxil edin..."
                      />
                    </div>

                    <p className="text-[9px] text-gray-400 font-bold italic border-t border-gray-100 pt-4 mt-2">Qeyd: Yalançı müraciətlər Azərbaycan Respublikasının qanunvericiliyinə əsasən məsuliyyət yarada bilər.</p>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !subject || !complaintText}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-emerald-600"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            GÖNDƏRİLİR...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            ELEKTRON ƏRİZƏNİ GÖNDƏR
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Property Extract (Çıxarış) Modal */}
      <AnimatePresence>
        {isPropertyModalOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsPropertyModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between no-print">
                <div>
                  <h2 className="font-black uppercase tracking-widest text-[#003366] flex items-center gap-3">
                    <FileBadge className="w-5 h-5 text-blue-600" />
                    Elektron Çıxarış (#00812903)
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">
                    <Download className="w-4 h-4" /> PDF Yüklə
                  </button>
                  <button onClick={() => setIsPropertyModalOpen(false)} className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div id="pdf-body" className="p-8 bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 w-full border border-gray-200 outline outline-4 outline-offset-4 outline-gray-100/50 shadow-sm relative">
                  <div className="absolute top-8 right-8 opacity-10">
                    <Shield className="w-24 h-24 text-gray-900" />
                  </div>
                  <div className="text-center mb-8 border-b-2 border-[#003366] pb-6">
                    <h1 className="text-xl font-black text-[#003366] leading-tight">AZƏRBAYCAN RESPUBLİKASI<br/>ƏMLAK MƏSƏLƏLƏRİ DÖVLƏT XİDMƏTİ</h1>
                    <p className="font-bold text-gray-500 mt-2 uppercase tracking-[0.2em] text-sm">Daşınmaz Əmlakın Dövlət Reyestri Çıxarışı</p>
                  </div>
                  
                  <div className="space-y-4 text-sm font-bold text-gray-700 relative z-10">
                    <div className="flex border-b border-dashed border-gray-200 pb-2">
                       <span className="w-1/3 text-gray-400 uppercase text-xs tracking-widest">Sahibi:</span>
                       <span className="w-2/3 text-gray-900">Məmmədov Əli Həsən oğlu</span>
                    </div>
                    <div className="flex border-b border-dashed border-gray-200 pb-2">
                       <span className="w-1/3 text-gray-400 uppercase text-xs tracking-widest">Ünvan:</span>
                       <span className="w-2/3 text-gray-900">Bakı ş., Nərimanov r-nu, Əhməd Rəcəbli küç., Bina 15, Mənzil 42</span>
                    </div>
                    <div className="flex border-b border-dashed border-gray-200 pb-2">
                       <span className="w-1/3 text-gray-400 uppercase text-xs tracking-widest">Sahəsi:</span>
                       <span className="w-2/3 text-gray-900">85.4 kv.m</span>
                    </div>
                    <div className="flex border-b border-dashed border-gray-200 pb-2">
                       <span className="w-1/3 text-gray-400 uppercase text-xs tracking-widest">Təyinatı:</span>
                       <span className="w-2/3 text-gray-900">Yaşayış fondu (Mənzil)</span>
                    </div>
                    <div className="flex border-b border-dashed border-gray-200 pb-2">
                       <span className="w-1/3 text-gray-400 uppercase text-xs tracking-widest">Verilmə Tarixi:</span>
                       <span className="w-2/3 text-gray-900">12 May 2018</span>
                    </div>
                    
                    <div className="mt-8 pt-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden p-1">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://e-gov.az/check/property/1A2B3C`} alt="QR" className="w-full h-full mix-blend-multiply" />
                      </div>
                      <div className="text-xs text-gray-400">
                        Sənədin etibarlılığını bu QR kod vasitəsilə e-Gov portalında yoxlaya bilərsiniz.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E-Tabib Booking Modal */}
      <AnimatePresence>
        {isDoctorModalOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsDoctorModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-red-100"
            >
              {showSuccess ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Qəbul Təsdiqləndi!</h2>
                  <p className="text-sm text-gray-500 font-bold">{successMessage}</p>
                </div>
              ) : (
                <>
                  <div className="p-6 bg-red-600 text-white flex items-center justify-between">
                    <div>
                      <h2 className="font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-5 h-5 opacity-70" />
                        E-Təbib Həkim Qəbulu
                      </h2>
                      <p className="text-[10px] text-red-200 font-bold mt-1 uppercase tracking-widest">Nərimanov r-nu, 4 Saylı Şəhər Poliklinikası</p>
                    </div>
                    <button onClick={() => setIsDoctorModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleBookDoctor} className="p-6 space-y-5">
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100 flex flex-col gap-1 text-sm text-gray-700">
                      <div className="flex gap-2 font-bold">
                        <span className="text-red-600 font-black">Həkim:</span> 
                        Dr. Səmədova Aytən (Ailə həkimi)
                      </div>
                      <div className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Ağa Nemətulla küç. 44 (Otaq 204)</div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Ziyarət Məqsədi</label>
                      <select 
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-red-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="yoxlanish">Ümumi Yoxlanış</option>
                        <option value="şikayət">Səhhətlə bağlı şikayət</option>
                        <option value="arayış">Arayış əldə etmək</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Qəbul Tarixi və Saatı</label>
                      <input 
                        required
                        type="datetime-local"
                        value={appointmentDate}
                        onChange={e => setAppointmentDate(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-red-500 focus:bg-white transition-all cursor-text appearance-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !appointmentDate}
                        className="w-full py-4 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-red-600"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            QEYDİYYATDAN KEÇİRİLİR...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            NÖVBƏYƏ YAZIL
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
