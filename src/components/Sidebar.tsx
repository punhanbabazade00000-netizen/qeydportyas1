import React from "react";
import { Building, Resident, PoliceOfficer } from "../types";
import { User, MapPin, Calendar, Building2, ChevronRight, FileText, ArrowLeft, Phone, Briefcase, Hash, Users, Activity, Shield, Mail, BadgeCheck, Star, DoorOpen } from "lucide-react";
import { cn } from "../lib/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface SidebarProps {
  selectedBuilding: Building | null;
  isAdmin?: boolean;
  onUpdateBuilding?: (building: Building) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedBuilding, isAdmin, onUpdateBuilding }) => {
  const [selectedBlock, setSelectedBlock] = React.useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = React.useState<string | null>(null);
  const [selectedResidentId, setSelectedResidentId] = React.useState<string | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState<any>(null);

  const isHospital = selectedBuilding?.type === "Hospital";
  const isPolice = selectedBuilding?.type === "Police";

  const selectedResident = React.useMemo(() => {
    if (!selectedBuilding || !selectedResidentId) return null;
    return selectedBuilding.residents.find(r => r.id === selectedResidentId);
  }, [selectedBuilding, selectedResidentId]);

  const selectedOfficer = React.useMemo(() => {
    if (!selectedBuilding || !selectedOfficerId || !selectedBuilding.officers) return null;
    return selectedBuilding.officers.find(o => o.id === selectedOfficerId);
  }, [selectedBuilding, selectedOfficerId]);

  // Group residents by block (Giriş)
  const blocks = React.useMemo(() => {
    if (!selectedBuilding || isPolice || isHospital) return [];
    const grouped = selectedBuilding.residents.reduce((acc, r) => {
      const block = r.block || "1"; // Default to block 1 if not specified
      if (!acc[block]) acc[block] = [];
      acc[block].push(r);
      return acc;
    }, {} as Record<string, Resident[]>);
    
    return Object.entries(grouped).sort((a, b) => {
      const numA = parseInt(a[0]);
      const numB = parseInt(b[0]);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a[0].localeCompare(b[0]);
    });
  }, [selectedBuilding, isPolice, isHospital]);

  // Group residents by apartment within a block
  const apartments = React.useMemo(() => {
    if (!selectedBuilding || !selectedBlock) return [];
    const residentsInBlock = selectedBuilding.residents.filter(r => (r.block || "1") === selectedBlock);
    const grouped = residentsInBlock.reduce((acc, r) => {
      const apt = r.apartmentNumber || "Qeyd edilməyib";
      if (!acc[apt]) acc[apt] = [];
      acc[apt].push(r);
      return acc;
    }, {} as Record<string, Resident[]>);
    
    return Object.entries(grouped).sort((a, b) => {
      const numA = parseInt(a[0]);
      const numB = parseInt(b[0]);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a[0].localeCompare(b[0]);
    });
  }, [selectedBuilding, selectedBlock]);

  const filteredResidents = React.useMemo(() => {
    if (!selectedBuilding) return [];
    if (!selectedApartment) return selectedBuilding.residents;
    return selectedBuilding.residents.filter(r => 
      r.apartmentNumber === selectedApartment && 
      (r.block || "1") === (selectedBlock || "1")
    );
  }, [selectedBuilding, selectedApartment, selectedBlock]);

  // Reset selection when building changes
  React.useEffect(() => {
    setSelectedResidentId(null);
    setSelectedOfficerId(null);
    setSelectedBlock(null);
    setSelectedApartment(null);
    setIsEditing(false);
  }, [selectedBuilding]);

  const handleEditStart = () => {
    setEditData(selectedResident || selectedOfficer);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedBuilding || !onUpdateBuilding) return;

    let updatedBuilding = { ...selectedBuilding };
    if (selectedResident) {
      updatedBuilding.residents = updatedBuilding.residents.map(r => r.id === selectedResident.id ? editData : r);
    } else if (selectedOfficer) {
      updatedBuilding.officers = updatedBuilding.officers?.map(o => o.id === selectedOfficer.id ? editData : o);
    }

    onUpdateBuilding(updatedBuilding);
    setIsEditing(false);
  };

  const handleAssignNew = () => {
    if (!selectedBuilding || !onUpdateBuilding) return;

    if (isPolice) {
      const newOfficer: PoliceOfficer = {
        id: `o-${Date.now()}`,
        fullName: "Yeni Əməkdaş",
        rank: "Polis Leytenantı",
        position: "Növbətçi",
        phone: "050-000-00-00",
        email: "new.officer@gmail.com",
        areaOfResponsibility: "Nərimanov Rayonu, X-ci Sahə"
      };
      onUpdateBuilding({
        ...selectedBuilding,
        officers: [...(selectedBuilding.officers || []), newOfficer]
      });
      setSelectedOfficerId(newOfficer.id);
      setIsEditing(true);
      setEditData(newOfficer);
    } else {
      const newResident: Resident = {
        id: `r-${Date.now()}`,
        fullName: "Yeni Vətəndaş",
        age: 30,
        birthDate: "1994-01-01",
        registrationDate: new Date().toISOString().split('T')[0],
        status: "Active",
        fin: "7XXXXXX",
        phone: "050-000-00-00",
        profession: "Mülki",
        gender: "Kişi",
        maritalStatus: "Subay",
        block: selectedBlock || "1",
        apartmentNumber: selectedApartment || "1"
      };
      onUpdateBuilding({
        ...selectedBuilding,
        residents: [...selectedBuilding.residents, newResident]
      });
      setSelectedResidentId(null);
      setSelectedResidentId(newResident.id);
      setIsEditing(true);
      setEditData(newResident);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedBuilding) return;

    const doc = new jsPDF();
    const title = `${selectedBuilding.address} - Bina Hesabatı`;
    
    // Add Header
    doc.setFontSize(18);
    doc.text("AZERBAYCAN RESPUBLIKASI E-DOVLET", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text(title, 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Tarix: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Umumi Sakin Sayi: ${selectedBuilding.residents.length}`, 20, 45);

    // Prepare table data
    const tableColumn = ["Ad, Soyad", "FIN", "Blok", "Menzil", "Pese / Is Yeri"];
    const tableRows = selectedBuilding.residents.map(r => [
      r.fullName,
      r.fin,
      r.block || "1",
      r.apartmentNumber || "-",
      `${r.workplace ? r.workplace + " - " : ""}${r.profession}`
    ]);

    // Generate Table
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: "striped",
      styles: { fontSize: 8, font: "helvetica" },
      headStyles: { fillColor: [0, 51, 102] }
    });

    // Save PDF
    doc.save(`Hesabat_${selectedBuilding.id}.pdf`);
  };

  const getHeaderTitle = () => {
    if (isHospital) return "Xəstəxana Məlumatları";
    if (isPolice) return "Polis Şöbəsi Məlumatları";
    return "Portal Məlumatları";
  };

  const getHeaderIcon = () => {
    if (isHospital) return <Activity className="w-6 h-6 text-red-200" />;
    if (isPolice) return <Shield className="w-6 h-6 text-emerald-200" />;
    return <Building2 className="w-6 h-6 text-blue-300" />;
  };

  const getHeaderBg = () => {
    if (isHospital) return "bg-red-700 underline decoration-red-400 decoration-4";
    if (isPolice) return "bg-emerald-900 border-b-4 border-emerald-500/50";
    return "bg-[#003366]";
  };

  return (
    <aside className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden shadow-2xl z-[1500]">
      {/* Header */}
      <div className={cn("p-6 text-white transition-all duration-500", getHeaderBg())}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
            {getHeaderIcon()}
            {getHeaderTitle()}
          </h2>
          {(selectedResident || selectedOfficer || selectedApartment || selectedBlock) && (
            <div className="flex gap-2">
               {isAdmin && !isEditing && (selectedResident || selectedOfficer) && (
                 <button 
                  onClick={handleEditStart}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                >
                  Düzəliş Et
                </button>
               )}
              <button 
                onClick={() => {
                  if (selectedResidentId || selectedOfficerId) {
                    setSelectedResidentId(null);
                    setSelectedOfficerId(null);
                  } else if (selectedApartment) {
                    setSelectedApartment(null);
                  } else if (selectedBlock) {
                    setSelectedBlock(null);
                  }
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Geri
              </button>
            </div>
          )}
        </div>
        
        {selectedBuilding ? (
          <div className="space-y-1">
            <p className="text-lg font-extrabold truncate drop-shadow-sm">{selectedBuilding.address}</p>
            <div className="flex items-center gap-3 text-[10px] font-bold text-white/70 uppercase tracking-widest">
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-full">
                {isHospital ? <Activity className="w-3 h-3" /> : (isPolice ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />)} 
                {isPolice ? `${selectedBuilding.officers?.length} Əməkdaş` : `${selectedBuilding.residents.length} ${isHospital ? "Pasiyent" : "Sakin"}`}
              </span>
              <span className="opacity-30">|</span>
              <span className="font-black">
                {selectedApartment ? `Mənzil №${selectedApartment}` : (selectedBlock ? `Giriş №${selectedBlock}` : (isHospital ? "Operativ Nəzarət" : (isPolice ? "DİD Nəzarəti" : "48 Mənzil")))}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-white/50">Xəritədə obyekt seçilməyib</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#fafafa]">
        {!selectedBuilding ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-2xl animate-bounce duration-[3000ms]">
              <MapPin className="w-10 h-10 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-gray-900 text-xl uppercase tracking-tight">Obyekt Seçin</h3>
              <p className="text-xs text-gray-400 font-bold max-w-[200px] leading-relaxed uppercase tracking-tighter">
                Vətəndaşların siyahısını və qeydiyyat məlumatlarını görmək üçün xəritədən bir binaya, klinikaya və ya polis şöbəsinə klikləyin.
              </p>
            </div>
          </div>
        ) : isEditing ? (
          <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">Məlumatların Redaktəsi</h3>
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-600">İmtina</button>
                <button onClick={handleSave} className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800">Yadda Saxla</button>
              </div>
            </div>

            <div className="space-y-5">
              {Object.keys(editData).map((key) => {
                const labels: Record<string, string> = {
                  fullName: "Ad, Soyad, Ata Adı",
                  age: "Yaş",
                  birthDate: "Doğum Tarixi",
                  registrationDate: "Qeydiyyat Tarixi",
                  block: "Giriş №",
                  apartmentNumber: "Mənzil №",
                  fin: "FİN Kod",
                  phone: "Mobil Nömrə",
                  profession: "Peşə / Vəzifə",
                  gender: "Cins",
                  maritalStatus: "Ailə Vəziyyəti",
                  visitReason: "Müraciət Səbəbi",
                  visitDate: "Müraciət Tarixi",
                  status: "Status",
                  rank: "Rütbə",
                  email: "E-poçt",
                  areaOfResponsibility: "Məsul Olduğu Sahə",
                  convictionReason: "Məhkumluq Səbəbi"
                };

                return key !== "id" && key !== "residents" && key !== "officers" && typeof editData[key] !== "object" && typeof editData[key] !== "boolean" && (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{labels[key] || key}</label>
                    <input 
                      type={key === "age" ? "number" : "text"}
                      value={editData[key] || ""}
                      onChange={(e) => setEditData({ ...editData, [key]: key === "age" ? parseInt(e.target.value) : e.target.value })}
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleSave} 
              className="w-full py-5 bg-[#003366] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/20 mt-8 hover:bg-blue-900 transition-all active:scale-95"
            >
              Məlumatları Yenilə
            </button>
          </div>
        ) : selectedOfficer ? (
           <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex flex-col items-center text-center">
               <div className="w-24 h-24 rounded-3xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-4 shadow-inner relative group">
                 <Shield className="w-12 h-12 text-emerald-700 group-hover:scale-110 transition-transform" />
                 <div className="absolute -bottom-1 -right-1 w-7 h-7 border-4 border-white rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                   <BadgeCheck className="w-3.5 h-3.5 text-white" />
                 </div>
               </div>
               <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{selectedOfficer.fullName}</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                 {selectedOfficer.rank}
               </p>
             </div>

             <div className="grid grid-cols-1 gap-3">
               {[
                 { label: "Rütbəsi", value: selectedOfficer.rank, icon: <BadgeCheck className="w-4 h-4 text-emerald-600" /> },
                 { label: "Mobil Nömrə", value: selectedOfficer.phone, icon: <Phone className="w-4 h-4 text-blue-600" /> },
                 { label: "Gmail Ünvanı", value: selectedOfficer.email, icon: <Mail className="w-4 h-4 text-red-500" /> },
                 selectedOfficer.areaOfResponsibility ? { label: "Məsul Olduğu Sahə", value: selectedOfficer.areaOfResponsibility, icon: <MapPin className="w-4 h-4 text-orange-500" /> } : null,
                 { label: "Vəzifəsi", value: selectedOfficer.position, icon: <Shield className="w-4 h-4 text-slate-500" /> },
                 { label: "Xidmət Sahəsi", value: "İctimai Asayişin Qorunması", icon: <Users className="w-4 h-4 text-indigo-500" /> },
               ].filter(Boolean).map((item: any, idx) => (
                 <div key={idx} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group">
                   <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">{item.icon}</div>
                   <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                     <p className="text-sm font-extrabold text-gray-800">{item.value}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        ) : selectedResident ? (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center mb-4 border shadow-sm relative transition-all", isHospital ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100")}>
                <User className={cn("w-12 h-12", isHospital ? "text-red-600" : "text-blue-600")} />
                <div className={cn("absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full shadow-sm", selectedResident.status === "Active" ? "bg-green-500" : "bg-red-500")}></div>
              </div>
              <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{selectedResident.fullName}</h3>
              <p className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full", isHospital ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-800")}>
                {isHospital ? selectedResident.visitReason : selectedResident.profession}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "FİN", value: selectedResident.fin, icon: <Hash className="w-4 h-4 text-orange-500" /> },
                { label: "Mobil Nömrə", value: selectedResident.phone, icon: <Phone className="w-4 h-4 text-green-500" /> },
                { label: "İş Yeri / Məşğuliyyət", value: selectedResident.workplace ? `${selectedResident.workplace} - ${selectedResident.profession}` : selectedResident.profession, icon: <Briefcase className="w-4 h-4 text-amber-600" /> },
                { label: "Doğum Tarixi / Yaş", value: `${selectedResident.birthDate} (${selectedResident.age} yaş)`, icon: <Calendar className="w-4 h-4 text-blue-500" /> },
                { label: isHospital ? "Müraciət Tarixi" : "Qeydiyyat Tarixi", value: isHospital ? selectedResident.visitDate : selectedResident.registrationDate, icon: <Activity className="w-4 h-4 text-red-500" /> },
                { label: "Ünvan", value: `Blok ${selectedResident.block || "1"}, Mənzil №${selectedResident.apartmentNumber}`, icon: <Building2 className="w-4 h-4 text-indigo-500" /> },
              ].filter(Boolean).map((item: any, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4 transition-all">
                  <div className="p-2.5 bg-gray-50 rounded-xl shadow-inner">{item.icon}</div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                    <p className="text-sm font-extrabold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !selectedBlock && !isPolice && !isHospital ? (
          /* LEVEL 1: BLOCK LIST */
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-gray-900 flex items-center gap-3 uppercase tracking-widest text-[11px]">
                <div className="w-2 h-6 rounded-full bg-blue-600"></div>
                Bina Üzrə Bloklar (Girişlər)
                <span className="px-2.5 py-1 rounded-lg text-[10px] border bg-blue-50 text-blue-700 border-blue-100">
                  {blocks.length} Blok
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {blocks.map(([blockNum, residents]) => (
                <div 
                  key={blockNum}
                  onClick={() => setSelectedBlock(blockNum)}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/5 group cursor-pointer transition-all flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <DoorOpen className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Giriş</p>
                    <p className="text-2xl font-black text-gray-900 leading-none">№ {blockNum}</p>
                  </div>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                    {residents.length} Sakin
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : !selectedApartment && !isPolice && !isHospital ? (
          /* LEVEL 2: APARTMENT LIST WITHIN BLOCK */
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-gray-900 flex items-center gap-3 uppercase tracking-widest text-[11px]">
                <div className="w-2 h-6 rounded-full bg-blue-600"></div>
                Blok №{selectedBlock} üzrə Mənzillər
                <span className="px-2.5 py-1 rounded-lg text-[10px] border bg-blue-50 text-blue-700 border-blue-100">
                  {apartments.length} Mənzil
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {apartments.map(([aptNum, residents]) => (
                <div 
                  key={aptNum}
                  onClick={() => setSelectedApartment(aptNum)}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/5 group cursor-pointer transition-all flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Building2 className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Ev</p>
                    <p className="text-2xl font-black text-gray-900 leading-none">№ {aptNum}</p>
                  </div>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                    {residents.length} Sakin
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* LEVEL 3: RESIDENTS LIST */
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-gray-900 flex items-center gap-3 uppercase tracking-widest text-[11px]">
                <div className={cn("w-2 h-6 rounded-full", isHospital ? "bg-red-600" : (isPolice ? "bg-emerald-600" : "bg-blue-600"))}></div>
                {selectedApartment ? `Mənzil №${selectedApartment} Sakinləri` : (isHospital ? "Son Müraciət Edənlər" : (isPolice ? "Əməkdaşların Siyahısı" : "Sakinlərin Siyahısı"))}
                <span className={cn("px-2.5 py-1 rounded-lg text-[10px] border", isHospital ? "bg-red-50 text-red-700 border-red-100" : (isPolice ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"))}>
                  {isPolice ? selectedBuilding.officers?.length : filteredResidents.length} nəfər
                </span>
              </h3>
              {isAdmin && (
                <button 
                  onClick={handleAssignNew}
                  className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:rotate-90 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                >
                  <Users className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {isPolice ? (
                selectedBuilding.officers?.map((officer) => (
                  <div 
                    key={officer.id}
                    onClick={() => setSelectedOfficerId(officer.id)}
                    className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:shadow-xl group cursor-pointer transition-all"
                  >
                     <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center transition-all group-hover:bg-emerald-600">
                          <Shield className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-900 mb-0.5 leading-none">{officer.fullName}</p>
                          <p className="text-[10px] font-black uppercase text-emerald-600">{officer.rank}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-emerald-600 transition-all" />
                    </div>
                  </div>
                ))
              ) : (
                filteredResidents.map((resident) => (
                  <div 
                    key={resident.id}
                    onClick={() => setSelectedResidentId(resident.id)}
                    className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-xl group cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner", isHospital ? "bg-red-50 group-hover:bg-red-600" : "bg-blue-50 group-hover:bg-blue-600")}>
                          <User className={cn("w-6 h-6 transition-colors", isHospital ? "text-red-600 group-hover:text-white" : "text-blue-600 group-hover:text-white")} />
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-900 mb-0.5 leading-none">{resident.fullName}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors text-left truncate max-w-[200px]">
                            {resident.workplace ? `${resident.workplace} - ` : ""}{resident.profession} • № {resident.apartmentNumber}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-blue-600 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {selectedBuilding && !(selectedResident || selectedOfficer) && (
        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <button 
            onClick={handleDownloadPDF}
            className={cn("w-full py-4 border-2 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-inner active:scale-95 hover:shadow-lg", 
            isHospital ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white" : 
            (isPolice ? "border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white")
          )}>
            <FileText className="w-5 h-5" />
            {isPolice ? "Həftəlik Növbətçilik Cədvəli" : (isHospital ? "Pasiyent Statistikası (Excel)" : "Bina Hesabatı (PDF)")}
          </button>
        </div>
      )}
    </aside>
  );
};
