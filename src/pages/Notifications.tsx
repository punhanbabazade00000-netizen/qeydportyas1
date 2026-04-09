import React, { useState } from "react";
import { Bell, AlertTriangle, Shield, CheckCircle2, Info, Plus, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  userName?: string;
}

export const Notifications: React.FC<Props> = ({ userName }) => {
  const isAdmin = userName?.toLowerCase().includes("admin");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Yeni Riskli Şəxs Qeydiyyatı",
      message: "Nərimanov rayonunda yeni riskli şəxs qeydiyyata alındı. Zəhmət olmasa yoxlanış aparın.",
      time: "10 dəqiqə əvvəl",
      read: false,
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />
    },
    {
      id: 2,
      type: "info",
      title: "Sistem Yenilənməsi",
      message: "Bu gecə saat 03:00-da sistemdə profilaktik işlər aparılacaq. Fasilələr ola bilər.",
      time: "1 saat əvvəl",
      read: false,
      icon: <Info className="w-5 h-5 text-blue-500" />
    },
    {
      id: 3,
      type: "security",
      title: "Təhlükəsizlik Auditi",
      message: "Həftəlik təhlükəsizlik hesabatı hazırdır və adminlər tərəfindən yoxlanılıb.",
      time: "2 saat əvvəl",
      read: true,
      icon: <Shield className="w-5 h-5 text-orange-500" />
    },
    {
      id: 4,
      type: "success",
      title: "Məlumatların Sinxronizasiyası",
      message: "Bütün vətəndaş məlumatları mərkəzi serverlə uğurla sinxronizasiya edildi.",
      time: "1 gün əvvəl",
      read: true,
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: "", message: "", target: "all", type: "info" });
  const [isGenerating, setIsGenerating] = useState(false);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleAIGenerate = () => {
    if (!newNotif.title) {
      alert("Süni İntellektin mətn yaratması üçün zəhmət olmasa əvvəlcə 'BAŞLIQ' (Mövzu) qeyd edin.");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI Generation time
    setTimeout(() => {
      let generatedText = "";
      const titleLower = newNotif.title.toLowerCase();
      
      if (titleLower.includes("karantin") || titleLower.includes("covid") || titleLower.includes("xəstəliy")) {
        generatedText = `Hörmətli vətəndaşlar, mövcud epidemioloji vəziyyətlə əlaqədar olaraq "${newNotif.title}" çərçivəsində tətbiq edilən qaydalara riayət etməyiniz xahiş olunur. Tibbi maskalardan istifadə və sosial məsafənin qorunması məcburidir. Təhlükəsizliyiniz və sağlamlığınız E-Dövlətin daim diqqət mərkəzindədir.`;
      } else if (titleLower.includes("kibercinayət") || titleLower.includes("fırıldaq") || titleLower.includes("kiber")) {
         generatedText = `DİQQƏT: Son günlər vətəndaşlara qarşı yönəlmiş "${newNotif.title}" halları geniş yayılmışdır. Bank kartı məlumatlarınızı (PIN, CVV və SMS şifrələri) heç kimlə, o cümlədən özünü bank işçisi kimi təqdim edən şəxslərlə paylaşmayın. Şübhəli zənglər aldıqda dərhal "102" xidmətinə məlumat verin.`;
      } else if (titleLower.includes("sistem") || titleLower.includes("texniki") || titleLower.includes("xidmət")) {
         generatedText = `E-Dövlətin Vətəndaş Qeydiyyatı Portalı üzrə "${newNotif.title}" tədbirləri həyata keçirilir. Gecə saat 02:00-dan 04:00-a qədər portalın fəaliyyətində qısamüddətli fasilələr yarana bilər. Yaranacaq narahatlığa görə üzr istəyirik.`;
      } else if (titleLower.includes("bayram") || titleLower.includes("təbrik") || titleLower.includes("novruz")) {
         generatedText = `Hörmətli vətəndaşlar, E-Dövlət olaraq sizi qarşıdan gələn "${newNotif.title}" münasibətilə təbrik edirik. Bayram günlərində asayişin və ictimai təhlükəsizliyin qorunması məqsədilə xidmətimiz gücləndirilmiş iş rejimində davam edir. Hər birinizə can sağlığı və xoşbəxtlik arzulayırıq.`;
      } else {
        generatedText = `Hörmətli istifadəçilər, "${newNotif.title}" ilə əlaqədar olaraq nəzərinizə çatdırırıq ki, müvafiq qayda və tələblərə əməl edilməsi vacibdir. Əlavə məlumat əldə etmək və ya yaranan suallarla bağlı əlaqədar idarəyə müraciət edə bilərsiniz. Layihənin icrası çərçivəsində yeniliklər barədə əlavə olaraq məlumat veriləcək.`;
      }

      setNewNotif(prev => ({ ...prev, message: generatedText }));
      setIsGenerating(false);
    }, 1500);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) return;

    let icon = <Info className="w-5 h-5 text-blue-500" />;
    if (newNotif.type === "alert") icon = <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (newNotif.type === "security") icon = <Shield className="w-5 h-5 text-orange-500" />;

    const notifObj = {
      id: Date.now(),
      type: newNotif.type,
      title: newNotif.title,
      message: newNotif.message + ` (Hədəf: ${newNotif.target === 'all' ? 'Bütün istifadəçilər' : 'Seçilmiş vətəndaş'})`,
      time: "İndi",
      read: false,
      icon
    };

    setNotifications(prev => [notifObj, ...prev]);
    setIsModalOpen(false);
    setNewNotif({ title: "", message: "", target: "all", type: "info" });
  };

  return (
    <div className="flex-1 h-full bg-white flex flex-col items-center py-10 overflow-y-auto relative">
      <div className="w-full max-w-4xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#003366] uppercase tracking-wider">Bildirişlər Sistemi</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Sistem və Təhlükəsizlik bildirişlərinin idarə edilməsi</p>
          </div>
          <div className="flex gap-4">
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                Yeni Bildiriş Göndər
              </button>
            )}
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
            >
              Oxunmuş qeyd et
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notif, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  notif.read ? "bg-white border-gray-100" : "bg-blue-50/50 border-blue-100 shadow-sm hover:border-blue-300"
                } flex gap-4 items-start`}
              >
                <div className={`p-3 rounded-xl ${notif.read ? "bg-gray-50" : "bg-white shadow-sm"}`}>
                  {notif.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold ${notif.read ? "text-gray-700" : "text-gray-900"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-6 bg-[#003366] text-white flex items-center justify-between">
                <h2 className="font-black uppercase tracking-widest flex items-center gap-3">
                  <Send className="w-5 h-5" />
                  Bildiriş Göndər
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendNotification} className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">KİMƏ GÖNDƏRİLSİN?</label>
                  <select 
                    value={newNotif.target}
                    onChange={e => setNewNotif({...newNotif, target: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-white/50 transition-all cursor-pointer"
                  >
                    <option value="all">Bütün vətəndaşlara (Kütləvi SMS)</option>
                    <option value="police">Polis şöbələrinə (Sistem bildirişi)</option>
                    <option value="person">Seçilmiş vətəndaşa fərdi (SMS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">BİLDİRİŞ NÖVÜ</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'info', label: 'Məlumat', icon: <Info className="w-4 h-4"/>, color: 'blue' },
                      { id: 'alert', label: 'Xəbərdarlıq', icon: <AlertTriangle className="w-4 h-4"/>, color: 'red' },
                      { id: 'security', label: 'Təhlükəsizlik', icon: <Shield className="w-4 h-4"/>, color: 'orange' },
                    ].map(t => (
                      <button 
                        key={t.id}
                        type="button"
                        onClick={() => setNewNotif({...newNotif, type: t.id})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all ${
                          newNotif.type === t.id 
                            ? `border-${t.color}-500 bg-${t.color}-50 text-${t.color}-700 shadow-sm` 
                            : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                        }`}
                      >
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">BAŞLIQ</label>
                  <input 
                    value={newNotif.title}
                    onChange={e => setNewNotif({...newNotif, title: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-white/50 transition-all"
                    placeholder="Məs: Karantin rejimi barədə xəbərdarlıq"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">MƏTN</label>
                    <button 
                      type="button" 
                      onClick={handleAIGenerate}
                      disabled={isGenerating}
                      className="text-[10px] font-black text-purple-600 flex items-center gap-1.5 hover:text-purple-800 transition-colors uppercase tracking-widest"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          İnteqrasiya olunur...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          AI ilə Rəsmi Mətn Yarat
                        </>
                      )}
                    </button>
                  </div>
                  <textarea 
                    value={newNotif.message}
                    onChange={e => setNewNotif({...newNotif, message: e.target.value})}
                    className={`w-full p-4 bg-gray-50 border rounded-xl text-sm outline-none transition-all resize-none h-28 ${
                      isGenerating ? "border-purple-300 ring-2 ring-purple-100 opacity-70" : "border-gray-200 focus:border-blue-500 focus:bg-white/50"
                    }`}
                    placeholder="Vətəndaşlara göndəriləcək mesajın mətni..."
                    required
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-4 bg-[#003366] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    BİLDİRİŞİ GÖNDƏR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
