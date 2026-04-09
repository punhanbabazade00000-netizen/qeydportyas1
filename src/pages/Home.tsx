import React from "react";
import { Landmark, Shield, Users, FileCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface HomeProps {
  userName?: string;
}

export const Home: React.FC<HomeProps> = ({ userName }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 relative">
      <section className="bg-[#003366] text-white py-16 px-4 relative overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
          <img src="/src/assets/din_logo.png" alt="DİN" className="w-[600px] grayscale invert" />
        </div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Xoş gəldiniz, <span className="text-blue-300">{userName || "Cənab Zabit"}</span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Azərbaycan Respublikası E-Dövlətin rəsmi elektron xidməti. 
              Binalar üzrə qeydiyyat məlumatlarının idarə edilməsi və monitorinqi.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/map"
                className="bg-white text-[#003366] px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg"
              >
                Xəritəyə keçid <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="bg-blue-700 text-white border border-blue-500 px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-all shadow-lg"
              >
                Daha ətraflı
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="w-10 h-10 text-blue-600" />,
              title: "Təhlükəsizlik",
              desc: "Bütün məlumatlar DİN-in daxili şəbəkəsində yüksək səviyyəli şifrələmə ilə qorunur.",
              link: "/security"
            },
            {
              icon: <Users className="w-10 h-10 text-blue-600" />,
              title: "Sakinlərin Siyahısı",
              desc: "Hər bir bina üzrə qeydiyyatda olan sakinlərin tam və dəqiq siyahısı.",
              link: "/residents"
            },
            {
              icon: <FileCheck className="w-10 h-10 text-blue-600" />,
              title: "Elektron Hesabat",
              desc: "Statistik məlumatların avtomatlaşdırılmış şəkildə toplanması və təhlili.",
              link: "/reports"
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <Link 
                to={feature.link}
                className="block bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
