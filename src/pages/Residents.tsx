import React, { useState } from "react";
import { Users, Search, ArrowLeft, Building2, UserCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const Residents: React.FC = () => {
  const [search, setSearch] = useState("");

  const mockResidents = [
    { id: 1, name: "Əli Məmmədov", address: "Nərimanov ray., Ağa Nemətulla 21, mən. 45", status: "Daimi" },
    { id: 2, name: "Fatma Kərimova", address: "Nəsimi ray., Azadlıq pr. 12, mən. 12", status: "Müvəqqəti" },
    { id: 3, name: "Rəşad Əliyev", address: "Səbail ray., Nizami küç. 8, mən. 3", status: "Daimi" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <div className="bg-white border-b border-gray-200 py-6 px-8 flex flex-col gap-4 z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors w-max">
          <ArrowLeft className="w-4 h-4" /> Əsas səhifəyə qayıt
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" /> Sakinlərin Siyahısı
            </h1>
            <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">
              Binalar üzrə qeydiyyatda olan vətəndaşlar
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Ad, Soyad və ya Ünvan axtar..."
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="container mx-auto max-w-5xl space-y-4">
          {mockResidents.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.address.toLowerCase().includes(search.toLowerCase())).map((resident, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={resident.id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="bg-blue-50 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                  <UserCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {resident.name}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${resident.status === 'Daimi' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {resident.status}
                    </span>
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <MapPin className="w-4 h-4" /> {resident.address}
                  </div>
                </div>
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-600 rounded-xl font-bold transition-all text-sm">
                Məlumat kartı
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
