import React, { useState, useMemo } from "react";
import { Landmark, Search, Bell, User, Menu, MessageSquare, Filter, Shield, AlertTriangle, Activity, MapPin, ChevronDown, ChevronLeft, Hash, ArrowRight, Building2, Star } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { mockBuildings } from "../data/mockData";
import { Resident } from "../types";

interface HeaderProps {
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRayon, setSelectedRayon] = useState("Nərimanov");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<"police" | "hospital" | "residential">("residential");

  // Advanced Filter States
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    gender: "",
    rank: "",
    position: "",
    ageMin: "",
    ageMax: "",
    maritalStatus: "",
    visitReason: "",
  });

  const filterItems = [
    { id: "risk", name: "Riskli Vətəndaşlar", icon: <AlertTriangle className="w-4 h-4" />, color: "text-orange-600", bg: "bg-orange-50" },
    { id: "convict", name: "Məhkum olunmuşlar", icon: <Shield className="w-4 h-4" />, color: "text-slate-900", bg: "bg-gray-100" },
    { id: "medical", name: "Tibbi Nəzarət", icon: <Activity className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-50" },
  ];

  const rayons = ["Nərimanov", "Yasamal", "Səbail", "Binəqədi", "Xətai", "Sabunçu"];

  // Advanced search results
  const searchResults = useMemo(() => {
    if (activeCategory !== "search_results") return [];

    let results: any[] = [];
    
    mockBuildings.forEach(building => {
      // Filter by Rayon first (optional, user might want to search across all if they didn't select specific)
      // but UI has a rayon selector, so we use it.
      if (selectedRayon && !building.address.includes(selectedRayon)) return;

      if (entityType === "police" && building.type === "Police" && building.officers) {
        const matches = building.officers.filter(o => {
          return (!filters.firstName || o.firstName?.toLowerCase().includes(filters.firstName.toLowerCase())) &&
                 (!filters.lastName || o.lastName?.toLowerCase().includes(filters.lastName.toLowerCase())) &&
                 (!filters.fatherName || o.fatherName?.toLowerCase().includes(filters.fatherName.toLowerCase())) &&
                 (!filters.gender || o.gender === filters.gender) &&
                 (!filters.maritalStatus || o.maritalStatus === filters.maritalStatus) &&
                 (!filters.rank || o.rank.toLowerCase().includes(filters.rank.toLowerCase())) &&
                 (!filters.position || o.position.toLowerCase().includes(filters.position.toLowerCase())) &&
                 (!filters.ageMin || (o.age && o.age >= parseInt(filters.ageMin))) &&
                 (!filters.ageMax || (o.age && o.age <= parseInt(filters.ageMax)));
        });
        results.push(...matches);
      } else if (entityType === "hospital" && building.type === "Hospital") {
        const matches = building.residents.filter(r => {
          return (!filters.firstName || r.firstName?.toLowerCase().includes(filters.firstName.toLowerCase())) &&
                 (!filters.lastName || r.lastName?.toLowerCase().includes(filters.lastName.toLowerCase())) &&
                 (!filters.fatherName || r.fatherName?.toLowerCase().includes(filters.fatherName.toLowerCase())) &&
                 (!filters.gender || r.gender === filters.gender) &&
                 (!filters.maritalStatus || r.maritalStatus === filters.maritalStatus) &&
                 (!filters.visitReason || r.visitReason?.toLowerCase().includes(filters.visitReason.toLowerCase())) &&
                 (!filters.ageMin || r.age >= parseInt(filters.ageMin)) &&
                 (!filters.ageMax || r.age <= parseInt(filters.ageMax));
        });
        results.push(...matches);
      } else if (entityType === "residential" && building.type === "Residential") {
        const matches = building.residents.filter(r => {
          return (!filters.firstName || r.firstName?.toLowerCase().includes(filters.firstName.toLowerCase())) &&
                 (!filters.lastName || r.lastName?.toLowerCase().includes(filters.lastName.toLowerCase())) &&
                 (!filters.fatherName || r.fatherName?.toLowerCase().includes(filters.fatherName.toLowerCase())) &&
                 (!filters.gender || r.gender === filters.gender) &&
                 (!filters.maritalStatus || r.maritalStatus === filters.maritalStatus) &&
                 (!filters.ageMin || r.age >= parseInt(filters.ageMin)) &&
                 (!filters.ageMax || r.age <= parseInt(filters.ageMax));
        });
        results.push(...matches);
      }
    });

    return results;
  }, [activeCategory, filters, entityType, selectedRayon]);

  // Legacy category filtering
  const getFilteredResidents = (categoryId: string): Resident[] => {
    const allResidents = mockBuildings.flatMap(b => b.residents);
    switch (categoryId) {
      case "risk": return allResidents.filter(r => r.age >= 75 || r.isMinor || r.isDisabled);
      case "convict": return allResidents.filter(r => r.isFormerlyConvicted);
      case "medical": return allResidents.filter(r => !!r.visitReason);
      default: return [];
    }
  };

  const activeResidents = useMemo(() => {
    if (activeCategory === "search_results") return searchResults;
    return activeCategory ? getFilteredResidents(activeCategory).slice(0, 15) : []; // Limit for display
  }, [activeCategory, searchResults]);

  const isCitizen = userName?.includes("Vətəndaş");

  const navItems = isCitizen ? [
    { name: "Mənim Profilim", path: "/" },
    { name: "Hesabım", path: "/profile" },
    { name: "Yardım", path: "/help" },
  ] : [
    { name: "Əsas Səhifə", path: "/" },
    { name: "Xəritə", path: "/map" },
    { name: "Statistika", path: "/statistics" },
    { name: "Hesabatlar", path: "/reports" },
    { name: "Yardım", path: "/help" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[2000] shadow-sm">
      <div className="max-w-[2000px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md p-1 border border-gray-100 group-hover:scale-105 transition-transform">
                <img src="/src/assets/din_logo.png" alt="DİN" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-[1.1rem] font-black text-[#003366] leading-none tracking-tighter uppercase whitespace-nowrap">AR Yaşayış Qeydiyyatı</h1>
                <p className="text-[9px] text-[#003366]/40 font-black uppercase tracking-[0.25em] mt-2">E-Dövlət</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            {!isCitizen && (
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setActiveCategory(null);
                  }}
                  className={cn(
                    "p-2 rounded-full transition-all relative group",
                    isFilterOpen ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-600"
                  )}
                  title="Filtrlər"
                >
                  <Filter className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">3</span>
                </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                    <motion.div 
                      key={activeCategory ? "category" : "main"}
                      initial={{ opacity: 0, x: activeCategory ? 10 : -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      {!activeCategory ? (
                        /* Main Filter View */
                        <div className="flex flex-col max-h-[85vh]">
                          <div className="p-6 bg-[#003366] text-white">
                            <h4 className="font-extrabold text-[10px] uppercase tracking-[0.2em] text-blue-200 mb-4 text-center underline underline-offset-8">Genişləndirilmiş Axtarış</h4>
                            
                            {/* Entity Type Selection */}
                            <div className="flex p-1 bg-white/10 rounded-2xl mb-6">
                              {[
                                { id: "police", name: "Şöbə", icon: <Shield className="w-3.5 h-3.5" /> },
                                { id: "hospital", name: "Hospital", icon: <Activity className="w-3.5 h-3.5" /> },
                                { id: "residential", name: "Binalar", icon: <Building2 className="w-3.5 h-3.5" /> },
                              ].map((t) => (
                                <button
                                  key={t.id}
                                  onClick={() => setEntityType(t.id as any)}
                                  className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    entityType === t.id ? "bg-white text-[#003366] shadow-lg" : "text-white/60 hover:text-white"
                                  )}
                                >
                                  {t.icon} {t.name}
                                </button>
                              ))}
                            </div>

                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                              <select 
                                value={selectedRayon}
                                onChange={(e) => setSelectedRayon(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-xs font-black appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                              >
                                {rayons.map(r => <option key={r} value={r} className="text-black">{r} Rayonu</option>)}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ad</label>
                                <input 
                                  value={filters.firstName} 
                                  onChange={e => setFilters({...filters, firstName: e.target.value})}
                                  placeholder="Məs: Əli" 
                                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all" 
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Soyad</label>
                                <input 
                                  value={filters.lastName} 
                                  onChange={e => setFilters({...filters, lastName: e.target.value})}
                                  placeholder="Məs: Məmmədov" 
                                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all" 
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ata Adı</label>
                              <input 
                                value={filters.fatherName} 
                                onChange={e => setFilters({...filters, fatherName: e.target.value})}
                                placeholder="Məs: Həsən" 
                                className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all" 
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Cins</label>
                                <select 
                                  value={filters.gender} 
                                  onChange={e => setFilters({...filters, gender: e.target.value})}
                                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none cursor-pointer"
                                >
                                  <option value="">Hamısı</option>
                                  <option value="Kişi">Kişi</option>
                                  <option value="Qadın">Qadın</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ailə Vəziyyəti</label>
                                <select 
                                  value={filters.maritalStatus} 
                                  onChange={e => setFilters({...filters, maritalStatus: e.target.value})}
                                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none cursor-pointer"
                                >
                                  <option value="">Hamısı</option>
                                  <option value="Subay">Subay</option>
                                  <option value="Evli">Evli</option>
                                  <option value="Dul">Dul</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Yaş Aralığı</label>
                              <div className="flex gap-2 items-center">
                                <input 
                                  type="number" 
                                  value={filters.ageMin} 
                                  onChange={e => setFilters({...filters, ageMin: e.target.value})}
                                  placeholder="Min" 
                                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none" 
                                />
                                <div className="h-[2px] w-4 bg-gray-200"></div>
                                <input 
                                  type="number" 
                                  value={filters.ageMax} 
                                  onChange={e => setFilters({...filters, ageMax: e.target.value})}
                                  placeholder="Max" 
                                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none" 
                                />
                              </div>
                            </div>

                            {entityType === "police" && (
                              <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-1.5">
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Rütbə</label>
                                  <input 
                                    value={filters.rank} 
                                    onChange={e => setFilters({...filters, rank: e.target.value})}
                                    placeholder="Polis Kapitanı" 
                                    className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none" 
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Vəzifə</label>
                                  <input 
                                    value={filters.position} 
                                    onChange={e => setFilters({...filters, position: e.target.value})}
                                    placeholder="Sahə Rəisi" 
                                    className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none" 
                                  />
                                </div>
                              </div>
                            )}

                            {entityType === "hospital" && (
                              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Müraciət Səbəbi</label>
                                <input 
                                  value={filters.visitReason} 
                                  onChange={e => setFilters({...filters, visitReason: e.target.value})}
                                  placeholder="Məs: Travma, İnfarkt..." 
                                  className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none" 
                                />
                              </div>
                            )}

                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveCategory("search_results")}
                              className="w-full py-4 bg-[#003366] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 mt-4 transition-all"
                            >
                               Nəticələri Görüntülə
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        /* Residents List View */
                        <div className="flex flex-col h-[400px]">
                          <div className="p-5 bg-slate-900 text-white flex items-center gap-4">
                            <button 
                              onClick={() => setActiveCategory(null)}
                              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                               <h4 className="font-extrabold text-xs uppercase tracking-widest">
                                 {filterItems.find(i => i.id === activeCategory)?.name}
                               </h4>
                               <p className="text-[9px] text-blue-200 font-bold uppercase tracking-widest mt-1">Siyahı • {activeResidents.length} nəfər</p>
                            </div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                             <div className="space-y-1">
                               {activeResidents.map((item: any) => {
                                 const isOfficer = !!item.rank;
                                 return (
                                  <button 
                                    key={item.id}
                                    className="w-full p-3 bg-white hover:bg-blue-50 border border-gray-100 rounded-2xl transition-all flex items-center justify-between group"
                                  >
                                    <div className="flex items-center gap-3">
                                       <div className={cn(
                                         "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                                         isOfficer ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-600 group-hover:text-white"
                                       )}>
                                          {isOfficer ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                       </div>
                                       <div className="text-left">
                                          <p className="text-[11px] font-black text-gray-800 leading-tight">{item.fullName}</p>
                                          <p className="text-[9px] text-gray-400 font-bold flex items-center gap-2 mt-0.5">
                                            {isOfficer ? <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> : <Hash className="w-2.5 h-2.5" />}
                                            {isOfficer ? `${item.rank}` : `${item.fin} • ${item.age} yaş`}
                                          </p>
                                          <p className={cn("text-[9px] font-black uppercase tracking-tighter mt-1 italic", isOfficer ? "text-emerald-600" : "text-blue-600")}>
                                            {isOfficer ? `Vəzifə: ${item.position}` : `İş yeri: ${item.profession}`}
                                          </p>
                                       </div>
                                    </div>
                                  </button>
                                 );
                               })}
                             </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4 bg-white border-t border-gray-100 text-center">
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                           {activeCategory ? "Tam Siyahını Yüklə (Excel)" : "Rayon üzrə tam hesabat"}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            )}

            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group"
              title="Canlı Dəstək"
            >
              <MessageSquare className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/notifications" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 group-hover:text-[#003366] transition-colors">{userName || "Sistem İstifadəçisi"}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{userName?.includes("Admin") ? "Baş Administrator" : isCitizen ? "Baza İstifadəçisi" : "Polis Kapitanı"}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shadow-inner overflow-hidden group-hover:border-blue-300 transition-colors">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
