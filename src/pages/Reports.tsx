import React, { useState } from "react";
import { FileText, Download, Filter, Calendar, Search, FileSpreadsheet, FilePieChart, X, Plus, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Report {
  id: number;
  title: string;
  date: string;
  type: string;
  size: string;
  category: string;
}

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    { id: 1, title: "Rüblük Sakin Hesabatı - Q1 2026", date: "2026-03-31", type: "PDF", size: "2.4 MB", category: "Statistika" },
    { id: 2, title: "Nərimanov Rayonu Üzrə Qeydiyyat Analizi", date: "2026-04-01", type: "XLSX", size: "1.1 MB", category: "Regional" },
    { id: 3, title: "Yeni Tikililərdə Məskunlaşma Hesabatı", date: "2026-03-15", type: "PDF", size: "4.8 MB", category: "Tikinti" },
    { id: 4, title: "İllik Demoqrafik Göstəricilər - 2025", date: "2026-01-10", type: "PDF", size: "12.5 MB", category: "İllik" },
    { id: 5, title: "Qeydiyyatdan Çıxarılan Şəxslərin Siyahısı", date: "2026-04-05", type: "XLSX", size: "850 KB", category: "Dinamika" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", category: "Statistika", type: "PDF" });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title) return;

    setIsGenerating(true);

    // Simulate generation delay
    setTimeout(() => {
      const report: Report = {
        id: Date.now(),
        title: newReport.title,
        date: new Date().toISOString().split('T')[0],
        type: newReport.type,
        size: (Math.random() * 5 + 1).toFixed(1) + " MB",
        category: newReport.category,
      };

      setReports([report, ...reports]);
      setIsGenerating(false);
      setIsModalOpen(false);
      setNewReport({ title: "", category: "Statistika", type: "PDF" });
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#003366] tracking-tight">Hesabatlar və Sənədlər</h2>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Rəsmi dövlət sənədlərinin arxivi</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#003366] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-900 transition-all flex items-center gap-2 shadow-2xl shadow-blue-900/20"
          >
            <Plus className="w-5 h-5" />
            Yeni Hesabat Yarat
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-6 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Hesabat və ya arxiv nömrəsi ilə axtarış..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>Bütün Kateqoriyalar</option>
              <option>Statistika</option>
              <option>Regional</option>
              <option>İllik</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>Son 30 gün</option>
              <option>Son 6 ay</option>
              <option>2025-ci il Arxiv</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sənəd müəllifi və adı</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Yaradılma Tarixi</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kateqoriya</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fayl Formatı</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Düymələr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((report, idx) => (
                <motion.tr 
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-blue-50/20 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${report.type === "PDF" ? "bg-red-50" : "bg-green-50"} transition-colors group-hover:scale-110 duration-300`}>
                        {report.type === "PDF" ? (
                          <FileText className="w-6 h-6 text-red-500" />
                        ) : (
                          <FileSpreadsheet className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors">{report.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider">{report.size} • Sistem Arxiv</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-bold text-gray-600">{report.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {report.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${report.type === "PDF" ? "bg-red-500" : "bg-green-500"}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${report.type === "PDF" ? "text-red-500" : "text-green-600"}`}>
                        {report.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="bg-gray-50 p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-[#003366]">Yeni Hesabat</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">Sistem generasasiyası</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateReport} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hesabatın Adı</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      placeholder="Məs: Aprel ayı statistikası..."
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sənədi Yükləyin (Opsional)</label>
                    <div className="relative group">
                      <input 
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewReport({ ...newReport, title: newReport.title || file.name.split('.')[0] });
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full px-5 py-5 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 group-hover:border-blue-300 transition-all">
                        <Plus className="w-6 h-6 text-blue-400 group-hover:scale-110 duration-200" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Faylı seçin və ya buraya sürüşdürün</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kateqoriya</label>
                      <select 
                        value={newReport.category}
                        onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none font-bold text-gray-600 transition-all cursor-pointer"
                      >
                        <option>Statistika</option>
                        <option>Regional</option>
                        <option>İllik</option>
                        <option>Dinamika</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fayl Formatı</label>
                      <select 
                        value={newReport.type}
                        onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none font-bold text-gray-600 transition-all cursor-pointer"
                      >
                        <option>PDF</option>
                        <option>XLSX</option>
                        <option>CSV</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={isGenerating || !newReport.title}
                    type="submit"
                    className="w-full py-5 bg-[#003366] text-white rounded-[2rem] font-black text-sm hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-blue-900/30 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 mt-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Emal edilir...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Hesabatı Arxivə Əlavə Et
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
