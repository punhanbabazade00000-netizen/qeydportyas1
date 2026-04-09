import React from "react";
import { Shield, Lock, CheckCircle2, Server, KeyRound, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const Security: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-[#003366] py-12 px-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Shield className="w-64 h-64 -mt-12 -mr-12" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Əsas səhifəyə qayıt
          </Link>
          <h1 className="text-4xl font-black mb-4">Sistem Təhlükəsizliyi</h1>
          <p className="text-blue-100 max-w-2xl text-lg">Məlumatlarınız DİN-in xüsusi qorunan serverlərində ən son şifrələmə texnologiyaları ilə arxivlənir.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {[ 
            { icon: <Lock className="w-8 h-8" />, title: "Uçdan Uca Şifrələmə", desc: "Bütün məlumatlar AES-256 bit şifrələmə protokolu ilə qorunur." },
            { icon: <Server className="w-8 h-8" />, title: "Lokal Serverlər", desc: "Heç bir xarici bağlantı olmadan DİN daxili intranetində fəaliyyət göstərir." },
            { icon: <KeyRound className="w-8 h-8" />, title: "Sıfır İcazə Siyasəti", desc: "İstifadəçilərin yalnız ehtiyacı olan məlumatlara baxmaq hüququ var." },
            { icon: <CheckCircle2 className="w-8 h-8" />, title: "Aktiv Monitorinq", desc: "7/24 təhlükəsizlik kameraları və proqram təminatı ilə izlənilir." }
          ].map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex items-start gap-6"
            >
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
