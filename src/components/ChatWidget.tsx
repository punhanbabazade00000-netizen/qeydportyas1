import React, { useState, useEffect, useRef } from "react";
import { X, Send, User, ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const FAQ_DATA = [
  {
    question: "Nərimanov qeydiyyatlılarını siyahıla",
    answer: "Nərimanov rayonu üzrə qeydiyyatda olan sakinlərin siyahısını 'Hesabatlar' bölməsindən regional filtr vasitəsilə və ya xəritədə həmin rayonu seçməklə əldə edə bilərsiniz."
  },
  {
    question: "Axtarışda olan şəxsi necə yoxlamalı?",
    answer: "Axtarışda olan şəxsləri yoxlamaq üçün 'Vətəndaş Yoxlanışı' bölməsinə keçib FİN kodunu və ya ŞV nömrəsini daxil edərək DİN bazası ilə çarpaz yoxlama apara bilərsiniz."
  },
  {
    question: "Operativ məlumat göndər",
    answer: "Şübhəli hallar və ya operativ məlumatlar üçün bu çat üzərindən dərhal 'Təcili Bildiriş' düyməsini sıxaraq növbətçi hissəyə məlumat ötürə bilərsiniz."
  },
  {
    question: "Mənzil üzrə sakin yoxlanışı",
    answer: "Mənzil üzrə yoxlama üçün 'Xəritə' bölməsində binanı seçib, sidebar vasitəsilə hər bir mənzildə qeydiyyatda olan şəxslərin tam siyahısını real-vaxt rejimində görə bilərsiniz."
  }
];

interface ChatWidgetProps {
  userName?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Gününüz şəfəqli olsun, ${userName || "Cənab Zabiti"}! Azərbaycan Respublikası Yaşayış Qeydiyyatı Portalının xidməti dəstək xəttinə xoş gəlmisiniz. Polis əməkdaşı olaraq sizə necə kömək edə bilərəm?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (text?: string) => {
    const finalMsg = text || inputValue;
    if (!finalMsg.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: finalMsg,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const faqMatch = FAQ_DATA.find(f => f.question === finalMsg);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: faqMatch 
          ? faqMatch.answer 
          : "Müraciətiniz qeydə alındı. Tezliklə əməkdaşımız sizə cavab verəcəkdir. Zəhmət olmasa gözləyin.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white/20 w-full max-w-lg h-[650px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#003366] p-6 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur border border-white/20 shadow-inner">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight text-white">Xidməti Operativ Dəstək</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></span>
                    <span className="text-[10px] text-blue-200 font-black uppercase tracking-[0.2em]">DİN Növbətçi Hissə</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 scrollbar-hide">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-400`}
                >
                  <div
                    className={`max-w-[85%] p-5 rounded-[2rem] text-sm shadow-md leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none shadow-blue-600/20"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-100 font-medium"
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[9px] mt-2 opacity-60 text-right font-black tracking-widest`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-4 bg-white border-t border-gray-50 flex gap-3 overflow-x-auto scrollbar-hide">
              {FAQ_DATA.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(faq.question)}
                  className="whitespace-nowrap px-6 py-3 bg-blue-50/50 text-blue-700 text-xs font-extrabold rounded-2xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm flex items-center gap-2 active:scale-95"
                >
                  <HelpCircle className="w-4 h-4" />
                  {faq.question}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Operativ sualınızı bura daxil edin..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="w-full pl-5 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all font-bold"
                />
                <button
                  onClick={() => handleSend()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-[1.25rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-90 disabled:opacity-50"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 text-center font-black uppercase tracking-[0.25em]">
                Məlumatlar xidməti istifadə üçün nəzərdə tutulub
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
