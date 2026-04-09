import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Home } from "./pages/Home";
import { MapPage } from "./pages/MapPage";
import { Statistics } from "./pages/Statistics";
import { Reports } from "./pages/Reports";
import { Help } from "./pages/Help";
import { About } from "./pages/About";
import { Profile } from "./pages/Profile";
import { Security } from "./pages/Security";
import { Residents } from "./pages/Residents";
import { ChatWidget } from "./components/ChatWidget";
import { Notifications } from "./pages/Notifications";
import { CitizenHome } from "./pages/CitizenHome";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    // Automatically open chat on first login
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-chat"));
    }, 500);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const isCitizen = userName.includes("Vətəndaş");

  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans antialiased text-gray-900">
        <Header userName={userName} />
        
        <main className="flex-1 flex overflow-hidden relative">
          <Routes>
            <Route path="/" element={isCitizen ? <CitizenHome /> : <Home userName={userName} />} />
            <Route path="/map" element={<MapPage userName={userName} />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile userName={userName} />} />
            <Route path="/security" element={<Security />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="/notifications" element={<Notifications userName={userName} />} />
          </Routes>
        </main>

        <ChatWidget userName={userName} />

        <footer className="bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center text-[10px] text-gray-400 font-bold z-[1100]">
          <div className="flex gap-4">
            <span>© 2026 AZƏRBAYCAN RESPUBLİKASI E-DÖVLƏT</span>
            <span className="text-gray-200">|</span>
            <span>BÜTÜN HÜQUQLAR QORUNUR</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">TƏHLÜKƏSİZLİK QAYDALARI</a>
            <a href="#" className="hover:text-blue-600 transition-colors">MƏXFİLİK SİYASƏTİ</a>
            <a href="#" className="hover:text-blue-600 transition-colors">ƏLAQƏ</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}
