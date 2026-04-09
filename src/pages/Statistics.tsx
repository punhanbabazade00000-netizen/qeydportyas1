import React from "react";
import { TrendingUp, Users, Home as HomeIcon, MapPin, Activity, ShieldAlert, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export const Statistics: React.FC = () => {
  // Main statistics cards
  const stats = [
    { label: "Ümumi Sakinlər", value: "2,450,120", icon: <Users className="w-5 h-5" />, color: "bg-blue-600" },
    { label: "Qeydiyyatda olan Binalar", value: "12,840", icon: <HomeIcon className="w-5 h-5" />, color: "bg-emerald-600" },
    { label: "Aktiv Qeydiyyatlar", value: "2,100,500", icon: <UserCheck className="w-5 h-5" />, color: "bg-indigo-600" },
    { label: "Risk Qrupundakılar", value: "4,200", icon: <ShieldAlert className="w-5 h-5" />, color: "bg-red-600" },
  ];

  // Age group distribution data
  const ageData = [
    { name: '0-17 yaş', value: 450000, color: '#0088FE' },
    { name: '18-35 yaş', value: 850000, color: '#00C49F' },
    { name: '36-60 yaş', value: 750000, color: '#FFBB28' },
    { name: '60+ yaş', value: 400120, color: '#FF8042' },
  ];

  // Regional distribution data
  const regionalData = [
    { name: 'Bakı', value: 1200000 },
    { name: 'Sumqayıt', value: 350000 },
    { name: 'Gəncə', value: 330000 },
    { name: 'Abşeron', value: 250000 },
    { name: 'Mingəçevir', value: 120120 },
    { name: 'Qəbələ', value: 100000 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fc]">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Activity className="text-blue-600" />
              DÖVLƏT REYESTRİ STATİSTİKASI
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
              Ölkə üzrə real-vaxt rejimli yaşayış qeydiyyatı hesabatı
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SİSTEM AKTİVDİR</span>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl transition-transform group-hover:rotate-12`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-150 transition-transform -z-0 opacity-50"></div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Regional Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                Regionlar üzrə Sakin Paylanması
              </h4>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8f9fc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Age Distribution Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                Yaş Qrupları Üzrə Bölgü
              </h4>
            </div>
            <div className="h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none">CƏMİ</p>
                <p className="text-lg font-black text-gray-900 leading-tight">100%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#003366] to-[#004080] p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/20"
        >
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight leading-tight">SİSTEMİN TAM STATİSTİK HESABATI (Excel / PDF)</h3>
            <p className="text-blue-100/70 text-xs font-bold uppercase tracking-widest max-w-md">
              Bütün rayonlar, yaş qrupları və cins bölgüsü üzrə ətraflı statistik məlumatları tək düymə ilə yükləyin.
            </p>
          </div>
          <button className="bg-white text-[#003366] px-10 py-5 rounded-[2rem] font-extrabold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
            HESABATI YÜKLƏ
          </button>
        </motion.div>
      </div>
    </div>
  );
};
