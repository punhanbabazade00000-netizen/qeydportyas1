import React from "react";
import { ShieldCheck, Scale, Cpu, Globe, Lock, CheckCircle2, Info, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const About: React.FC = () => {
  const sections = [
    {
      icon: <Scale className="w-8 h-8 text-blue-600" />,
      title: "Hüquqi Əsaslar",
      content: "Portal Azərbaycan Respublikasının Konstitusiyası, 'Yaşayış yeri və olduğu yer üzrə qeydiyyat haqqında' Qanun və müvafiq Prezident Fərmanları əsasında fəaliyyət göstərir. Bütün qeydiyyat prosesləri qanunvericiliyin tələblərinə tam uyğundur."
    },
    {
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      title: "Texnoloji İnfrastruktur",
      content: "Sistem ən müasir bulud texnologiyaları və yüksək sürətli verilənlər bazası idarəetmə sistemləri üzərində qurulub. Real-vaxt rejimində sinxronizasiya və 99.9% əlçatanlıq təmin edilir."
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "Məlumatların Mühafizəsi",
      content: "Fərdi məlumatların təhlükəsizliyi 'Fərdi məlumatlar haqqında' Qanuna uyğun olaraq qorunur. Məlumatlar yalnız xidməti istifadə üçün nəzərdə tutulub və kənar müdaxilələrdən ISO 27001 standartları ilə mühafizə olunur."
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: "İnteqrasiya İmkanları",
      content: "Portal ASAN Login, Elektron Hökumət Portalı (e-gov.az) və digər dövlət informasiya sistemləri ilə tam inteqrasiya olunub. Bu, məlumatların dürüstlüyünü və operativliyini artırır."
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#003366] to-[#004080] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Əsas səhifəyə qayıt
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Portal Haqqında Ətraflı Məlumat
          </motion.h1>
          <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Vətəndaşların yaşayış yeri üzrə qeydiyyatı sisteminin şəffaflığını və operativliyini təmin edən vahid dövlət platforması.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sistemin Məqsədi və Əhəmiyyəti</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Yaşayış Qeydiyyatı Portalı, Azərbaycan Respublikası E-Dövlət tərəfindən vətəndaşların yaşayış yeri üzrə qeydiyyat məlumatlarının daha səmərəli idarə edilməsi üçün yaradılmışdır.
                </p>
                <p>
                  Sistemin əsas məqsədi qeydiyyat proseslərini rəqəmsallaşdırmaq, kağız dövriyyəsini minimuma endirmək və dövlət orqanları üçün dəqiq statistik bazanı təmin etməkdir.
                </p>
                <ul className="space-y-3 mt-6">
                  {[
                    "Dəqiq demoqrafik uçotun aparılması",
                    "Xidməti ərazilər üzrə operativ nəzarət",
                    "Vətəndaş məmnuniyyətinin artırılması",
                    "Məlumatların mərkəzləşdirilmiş idarəetməsi"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-blue-50 rounded-3xl p-8 border border-blue-100 relative"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-xl">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Vacib Qeyd
                  </h4>
                  <p className="text-sm text-gray-500 italic">
                    "Bu portal yalnız səlahiyyətli şəxslər və müvafiq dövlət qurumlarının əməkdaşları üçün nəzərdə tutulub. Giriş yalnız xidməti identifikasiya vasitələri ilə mümkündür."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl">
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-[10px] uppercase font-bold opacity-80">Rəqəmsal Xidmət</p>
                  </div>
                  <div className="bg-white border border-blue-100 p-4 rounded-2xl">
                    <p className="text-2xl font-bold text-blue-600">24/7</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Monitorinq</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all bg-white group"
              >
                <div className="mb-4 p-3 bg-blue-50 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-20 px-4 border-t border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sualınız var?</h2>
          <p className="text-gray-600 mb-10">
            Sistemlə bağlı hər hansı bir sualınız və ya təklifiniz olarsa, bizimlə əlaqə saxlamaqdan çəkinməyin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/help" className="bg-[#003366] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg">
              Yardım Mərkəzinə keç
            </Link>
            <a href="mailto:info@din.gov.az" className="bg-white text-gray-700 border border-gray-200 px-10 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
              E-poçt vasitəsilə yaz
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
