import React from "react";
import { HelpCircle, MessageSquare, Phone, Mail, BookOpen, ChevronRight, Search, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export const Help: React.FC = () => {
  const faqs = [
    { q: "Sistemə necə daxil olmaq olar?", a: "Sistemə daxil olmaq üçün DİN tərəfindən təqdim edilmiş xidməti vəsiqə məlumatları və ya ASAN Login vasitəsilə autentifikasiyadan keçmək lazımdır." },
    { q: "Məlumatların yenilənmə tezliyi nə qədərdir?", a: "Yaşayış qeydiyyatı məlumatları mərkəzi verilənlər bazası ilə real-vaxt rejimində sinxronizasiya olunur." },
    { q: "Hesabatları necə ixrac etmək olar?", a: "Hesabatlar bölməsinə daxil olaraq, istədiyiniz sənədin qarşısındakı 'Yüklə' düyməsini sıxmaqla PDF və ya Excel formatında əldə edə bilərsiniz." },
    { q: "Xəritədə bina məlumatı səhvdirsə nə etməli?", a: "Belə hallarda dərhal 'Texniki Dəstək' bölməsinə müraciət edərək koordinatların və ya ünvanın dəqiqləşdirilməsini tələb edə bilərsiniz." },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="container mx-auto max-w-5xl">

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Qaynar Xətt</h3>
            <p className="text-sm text-gray-500 mb-4">7/24 operativ dəstək üçün zəng edin</p>
            <p className="text-lg font-bold text-blue-700">102 / (012) 590-XX-XX</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">E-poçt Dəstəyi</h3>
            <p className="text-sm text-gray-500 mb-4">Rəsmi müraciətlər üçün yazın</p>
            <p className="text-lg font-bold text-green-700">support@din.gov.az</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Canlı Çat</h3>
            <p className="text-sm text-gray-500 mb-4">Operatorla dərhal əlaqə saxlayın</p>
            <button className="mt-auto bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors">
              Söhbətə Başla
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              Tez-tez verilən suallar
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                >
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group">
                    <span className="font-bold text-gray-800">{faq.q}</span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </button>
                  <div className="px-6 py-4 bg-blue-50/30 text-sm text-gray-600 border-t border-gray-50">
                    {faq.a}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Təlimatlar
            </h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <ul className="space-y-4">
                {["İstifadəçi Təlimatı (PDF)", "Video Təlimat", "Təhlükəsizlik Qaydaları", "Sistem Yenilikləri"].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group">
                      {item}
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#003366] p-6 rounded-2xl text-white shadow-xl">
              <h4 className="font-bold mb-2">Mobil Tətbiq</h4>
              <p className="text-xs text-blue-200 mb-4 leading-relaxed">
                Portalın mobil versiyasını yükləyərək məlumatlara daha sürətli daxil olun.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-white/10 rounded border border-white/20 flex items-center justify-center text-[10px] font-bold">App Store</div>
                <div className="flex-1 h-10 bg-white/10 rounded border border-white/20 flex items-center justify-center text-[10px] font-bold">Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
