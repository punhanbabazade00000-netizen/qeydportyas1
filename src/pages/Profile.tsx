import React, { useState, useMemo } from "react";
import { User, Shield, MapPin, Briefcase, Lock, Eye, Edit, Star, Phone, Mail, Calendar, Hash, Building2, Save, ArrowLeft, BadgeCheck, Users, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { mockBuildings } from "../data/mockData";
import { PoliceOfficer } from "../types";

interface ProfileProps {
  userName?: string;
}

export const Profile: React.FC<ProfileProps> = ({ userName }) => {
  const isAdmin = userName?.toLowerCase().includes("admin");
  const [selectedRayon, setSelectedRayon] = useState<string | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<PoliceOfficer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Group police stations by "Rayon" (extracted from address)
  const rayonData = useMemo(() => {
    const stations = mockBuildings.filter(b => b.type === "Police");
    const grouped: Record<string, typeof stations> = {};
    
    stations.forEach(s => {
      const rayon = s.address.split(" ")[0].replace(",", ""); // Extract first word as Rayon
      if (!grouped[rayon]) grouped[rayon] = [];
      grouped[rayon].push(s);
    });
    return grouped;
  }, []);

  const rayons = Object.keys(rayonData);

  const handleSave = () => {
    // In a real app, this would update the backend/global state
    // For now, we simulate success
    setIsEditing(false);
    setSelectedOfficer(editData);
  };

  const renderEditForm = () => {
    const labels: Record<string, string> = {
      fullName: "Ad, Soyad, Ata Adı",
      rank: "Rütbə",
      position: "Vəzifə",
      phone: "Mobil Nömrə",
      email: "Xidməti E-poçt",
      areaOfResponsibility: "Məsul Olduğu Sahə",
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[2rem] p-8 shadow-2xl border border-blue-100 space-y-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">Profilin Redaktəsi</h3>
          <button onClick={() => setIsEditing(false)} className="text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase">İmtina</button>
        </div>
        
        <div className="space-y-4">
          {Object.keys(labels).map(key => (
            <div key={key} className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{labels[key]}</label>
              <input 
                type="text"
                value={editData[key] || ""}
                onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave} 
          className="w-full py-5 bg-[#003366] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.25em] shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
        >
          Dəyişiklikləri Təsdiqlə
        </button>
      </motion.div>
    );
  };

  if (!isAdmin) {
    // Find the current user in the mock data
    let currentUser: PoliceOfficer | null = null;
    let currentUserRayon: string = "";

    mockBuildings.forEach(b => {
      if (b.type === "Police" && b.officers) {
        const found = b.officers.find(o => o.fullName === userName);
        if (found) {
          currentUser = found;
          currentUserRayon = b.address.split(" ")[0].replace(",", "");
        }
      }
    });

    const displayRank = currentUser?.rank || "Əməkdaş";

    return (
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100"
          >
             <div className="bg-[#003366] p-12 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                   <Shield className="w-[400px]" />
                </div>
                <div className="relative z-10 flex items-center gap-8">
                  <div className="w-32 h-32 bg-white/10 rounded-[2.5rem] flex items-center justify-center border-4 border-white/20 backdrop-blur-sm shadow-2xl">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-4xl font-black tracking-tight">{userName || "İstifadəçi"}</h2>
                    <p className="text-blue-200 mt-3 font-bold tracking-[0.2em] uppercase text-xs flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10">
                      <Star className="w-4 h-4" /> {displayRank} • {currentUser?.position || "Peşəkar"}
                    </p>
                  </div>
                </div>
             </div>
             
             {currentUser ? (
               isEditing ? (
                 <div className="p-10">
                   {renderEditForm()}
                 </div>
               ) : (
               <div className="p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Şəxsi Məlumatlar</h4>
                    <button 
                      onClick={() => { setEditData(currentUser); setIsEditing(true); }}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Düzəliş Et
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                     {[
                        { label: "Tam Adı", value: currentUser.fullName, icon: <User className="w-4 h-4 text-blue-600" /> },
                        { label: "Xidməti Rütbəsi", value: currentUser.rank, icon: <Star className="w-4 h-4 text-amber-500" /> },
                        { label: "Vəzifə Təyinatı", value: currentUser.position, icon: <Briefcase className="w-4 h-4 text-indigo-500" /> },
                        { label: "Xidmət Etdiyi Rayon", value: currentUserRayon + " Rayonu", icon: <Building2 className="w-4 h-4 text-indigo-500" /> },
                        { label: "Mobil Nömrəsi", value: currentUser.phone, icon: <Phone className="w-4 h-4 text-green-500" /> },
                        { label: "Xidməti E-poçtu", value: currentUser.email, icon: <Mail className="w-4 h-4 text-sky-500" /> },
                        { label: "Məsuliyyət Sahəsi", value: currentUser.areaOfResponsibility || "Ümumi Nəzarət", icon: <MapPin className="w-4 h-4 text-red-500" /> },
                     ].map((item, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4 hover:bg-blue-50/50 hover:border-blue-100 transition-all group">
                           <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">{item.icon}</div>
                           <div className="flex-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                              <p className="text-sm font-extrabold text-gray-900 mt-1">{item.value}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-8 p-6 bg-blue-50/50 rounded-[1.5rem] border border-blue-100 flex items-start gap-5">
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                        <Shield className="w-6 h-6" />
                     </div>
                     <div>
                       <p className="text-sm font-black text-[#003366]">Operativ Redaktə İcazəsi Cəlb Olunmuşdur</p>
                       <p className="text-[10px] text-blue-800/80 font-bold uppercase tracking-widest mt-1.5 leading-relaxed">
                          Sizin profiliniz vasitəsilə qeyd olunan əlaqə və məsuliyyət sahəsi məlumatlarını birbaşa sistemdə yeniləyə bilərsiniz.
                       </p>
                     </div>
                  </div>
               </div>
               )
             ) : (
               <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                 Sistemdə ətraflı şəxsi profil tapılmadı.
               </div>
             )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-10 space-y-10">
        
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Səlahiyyət Paneli</h1>
            <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" /> Baş Administrator — Tam İdarəetmə Hubı
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white border border-gray-200 p-2 rounded-2xl flex items-center gap-3 px-5 shadow-sm">
               <Search className="w-4 h-4 text-gray-400" />
               <input type="text" placeholder="Axtarış..." className="outline-none text-xs font-bold w-48" />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Sidebar Area: Rayons and Officers */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            
            {/* Territory Grid */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <MapPin className="w-4 h-4" /> Xidmət Sahələri (Rayonlar)
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 {rayons.map(rayon => (
                    <button 
                      key={rayon} 
                      onClick={() => { setSelectedRayon(rayon); setSelectedOfficer(null); setIsEditing(false); }}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all text-left group",
                        selectedRayon === rayon 
                          ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30" 
                          : "bg-gray-50 border-gray-100 hover:border-blue-200 text-gray-900"
                      )}
                    >
                      <Building2 className={cn("w-6 h-6 mb-3 group-hover:scale-110 transition-transform", selectedRayon === rayon ? "text-white" : "text-blue-600")} />
                      <p className="text-sm font-black uppercase tracking-tight">{rayon}</p>
                      <p className={cn("text-[9px] font-bold mt-1", selectedRayon === rayon ? "text-blue-100" : "text-gray-400 uppercase")}>
                        {rayonData[rayon].length} Şöbə
                      </p>
                    </button>
                 ))}
               </div>
            </div>

            {/* Officer List Section */}
            <AnimatePresence mode="wait">
              {selectedRayon && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100"
                >
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Users className="w-4 h-4" /> {selectedRayon} Rayonunun Şəxsi Heyəti
                  </h3>
                  <div className="space-y-3">
                     {rayonData[selectedRayon].flatMap(s => s.officers || []).map(officer => {
                       const isChief = officer.position === "Sahə Rəisi";
                       return (
                        <button 
                          key={officer.id}
                          onClick={() => { setSelectedOfficer(officer); setIsEditing(false); }}
                          className={cn(
                            "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all text-left",
                            selectedOfficer?.id === officer.id 
                              ? "bg-blue-50 border-blue-500 shadow-lg" 
                              : "bg-white border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              isChief ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                            )}>
                              {isChief ? <Star className="w-5 h-5 fill-current" /> : <User className="w-5 h-5" />}
                            </div>
                            <div>
                               <p className="text-xs font-black text-gray-900 leading-none">{officer.fullName}</p>
                               <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{officer.rank} • {officer.position}</p>
                            </div>
                          </div>
                          <BadgeCheck className={cn("w-4 h-4", isChief ? "text-amber-500" : "text-blue-500")} />
                        </button>
                       );
                     })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Details & Edit Section */}
          <div className="col-span-12 lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedOfficer ? (
                isEditing ? (
                  renderEditForm()
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden"
                  >
                     <div className="bg-[#003366] p-10 relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                           <Shield className="w-[300px]" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                           <div className="flex items-center gap-8">
                              <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-[2rem] flex items-center justify-center border-4 border-white/20 shadow-xl">
                                <User className="w-12 h-12 text-white" />
                              </div>
                              <div className="text-white">
                                <h2 className="text-2xl font-black uppercase tracking-tight">{selectedOfficer.fullName}</h2>
                                <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mt-2 bg-white/10 inline-block px-3 py-1 rounded-full border border-white/10">
                                  {selectedOfficer.rank}
                                </p>
                              </div>
                           </div>
                           <button 
                             onClick={() => { setEditData(selectedOfficer); setIsEditing(true); }}
                             className="p-4 bg-white/10 hover:bg-white text-white hover:text-[#003366] rounded-2xl transition-all border border-white/10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                           >
                              <Edit className="w-4 h-4" /> Profili Redaktə Et
                           </button>
                        </div>
                     </div>
                     
                     <div className="p-10">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8">Tam Şəxsi Vərəqə (Genişləndirilmiş)</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                           {[
                              { label: "Tam Adı", value: selectedOfficer.fullName, icon: <User className="w-4 h-4 text-blue-600" /> },
                              { label: "Xidməti Rütbəsi", value: selectedOfficer.rank, icon: <Star className="w-4 h-4 text-amber-500" /> },
                              { label: "Mobil Nömrəsi", value: selectedOfficer.phone, icon: <Phone className="w-4 h-4 text-green-500" /> },
                              { label: "Xidməti E-poçtu", value: selectedOfficer.email, icon: <Mail className="w-4 h-4 text-sky-500" /> },
                              { label: "Məsuliyyət Sahəsi", value: selectedOfficer.areaOfResponsibility || "Ümumi Nəzarət", icon: <MapPin className="w-4 h-4 text-red-500" /> },
                              { label: "Vəzifə Təyinatı", value: selectedOfficer.rank === "Sahə Rəisi" ? "Territoriya Rəhbəri" : "Operativ Müavini", icon: <Briefcase className="w-4 h-4 text-indigo-500" /> },
                           ].map((item, idx) => (
                              <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                                 <div className="p-3 bg-white rounded-xl shadow-sm">{item.icon}</div>
                                 <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-sm font-extrabold text-gray-900 mt-0.5">{item.value}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                        
                        <div className="mt-8 p-6 bg-blue-50/50 rounded-[1.5rem] border border-blue-100 flex items-center gap-5">
                           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                              <Shield className="w-6 h-6" />
                           </div>
                           <p className="text-[10px] text-blue-800 font-bold leading-relaxed">
                              Cari əməkdaş haqqında məlumatlar DİN mərkəzi bazasından götürülmüşdür. Hər hansı qanunsuz dəyişiklik məsuliyyət yaradır.
                           </p>
                        </div>
                     </div>
                  </motion.div>
                )
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center text-center p-20 space-y-8 bg-white rounded-[3rem] border border-dashed border-gray-200">
                   <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center border border-gray-100 shadow-inner">
                      <Search className="w-12 h-12 text-gray-200" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Əməkdaş Seçilməyib</h3>
                     <p className="max-w-[280px] text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                       Məlumatlarını redaktə etmək və ya profili görüntüləmək üçün soldakı siyahıdan bir rayon və sonra işçi seçin.
                     </p>
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};
