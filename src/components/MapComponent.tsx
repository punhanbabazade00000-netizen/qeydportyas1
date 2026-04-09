import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Building } from "../types";
import { mockBuildings } from "../data/mockData";
import { Search, Navigation, Info, Shield, Activity, Building2 } from "lucide-react";

// Custom SVG Marker to avoid image loading issues and look more professional
const createCustomIcon = (type: "Residential" | "Hospital" | "Police", isSelected: boolean) => {
  let color = "#2563eb"; // Residential
  if (type === "Hospital") color = "#dc2626";
  if (type === "Police") color = "#064e3b";
  if (isSelected) color = "#000000";

  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C11.03 2 7 6.03 7 11C7 18.75 16 30 16 30C16 30 25 18.75 25 11C25 6.03 20.97 2 16 2Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="11" r="4" fill="white"/>
      ${isSelected ? '<circle cx="16" cy="11" r="6" stroke="white" stroke-width="1.5" stroke-dasharray="2 1"/>' : ''}
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "custom-map-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapComponentProps {
  buildings: Building[];
  onBuildingSelect: (building: Building) => void;
  selectedBuildingId?: string;
}

// Helper component to handle map interactions
const MapController = ({ selectedBuilding }: { selectedBuilding?: Building }) => {
// ... same ...
  const map = useMap();
  
  useEffect(() => {
    if (selectedBuilding) {
      map.flyTo(selectedBuilding.coordinates, 17, {
        duration: 1.5
      });
    }
  }, [selectedBuilding, map]);

  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({ buildings, onBuildingSelect, selectedBuildingId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
  const defaultCenter: [number, number] = [40.4005, 49.8735];

  const filteredBuildings = buildings.filter(b => 
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full relative group">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {buildings.map((building) => (
          <Marker
            key={building.id}
            position={building.coordinates}
            icon={createCustomIcon(building.type, selectedBuildingId === building.id)}
            eventHandlers={{
              click: () => onBuildingSelect(building),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-4 min-w-[220px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl ${
                    building.type === "Hospital" ? "bg-red-50 text-red-600" : 
                    (building.type === "Police" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-600")
                  }`}>
                    {building.type === "Hospital" ? <Activity className="w-4 h-4" /> : 
                     (building.type === "Police" ? <Shield className="w-4 h-4" /> : <Building2 className="w-4 h-4" />)}
                  </div>
                  <h3 className="font-black text-gray-900 text-xs leading-tight uppercase tracking-tight">{building.address}</h3>
                </div>
                <div className="space-y-1.5 mb-4">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em]">Nərimanov Rayon İdarəsi</p>
                  <p className="text-[10px] font-black text-gray-700">
                    Sektor: <span className={
                      building.type === "Hospital" ? "text-red-500" : 
                      (building.type === "Police" ? "text-emerald-700" : "text-blue-500")
                    }>
                      {building.type === "Hospital" ? "Tibbi Nəzarət" : 
                       (building.type === "Police" ? "Daxili İşlər" : "Sakin Qeydiyyatı")}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">
                      {building.type === "Hospital" ? "Operativ Giriş" : 
                       (building.type === "Police" ? `${building.officers?.length} Əməkdaş` : `${building.residents.length} Vətəndaş`)}
                    </span>
                  </div>
                  <button
                    onClick={() => onBuildingSelect(building)}
                    className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-lg active:scale-95 ${
                      building.type === "Hospital" ? "bg-red-600 hover:bg-red-700 shadow-red-200" : 
                      (building.type === "Police" ? "bg-emerald-900 hover:bg-emerald-950 shadow-emerald-200" : "bg-[#003366] hover:bg-blue-900 shadow-blue-200")
                    }`}
                  >
                    Məlumat Panelini Aç
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapController selectedBuilding={selectedBuilding} />
      </MapContainer>

      {/* Map Overlays */}
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <div className="bg-white/95 backdrop-blur shadow-2xl rounded-[1.5rem] border border-gray-200 overflow-hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Ünvan və ya Obyekt üzrə axtarış..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-transparent"
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          {searchQuery && (
            <div className="max-h-64 overflow-y-auto border-t border-gray-100 bg-white/50">
              {filteredBuildings.length > 0 ? (
                filteredBuildings.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onBuildingSelect(b);
                      setSearchQuery("");
                    }}
                    className="w-full px-5 py-3 text-left text-xs font-black uppercase tracking-tight hover:bg-blue-50 flex items-center gap-3 transition-all border-b border-gray-50/50"
                  >
                    <div className={`p-1.5 rounded-lg ${b.type === "Hospital" ? "bg-red-50 text-red-500" : (b.type === "Police" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-500")}`}>
                      <Navigation className="w-3 h-3" />
                    </div>
                    <span className="truncate text-gray-700">{b.address}</span>
                  </button>
                ))
              ) : (
                <div className="px-5 py-4 text-[10px] text-gray-400 italic font-black uppercase">Heç bir obyekt tapılmadı</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur shadow-2xl p-6 rounded-[2.5rem] border border-white/50 z-[1000] min-w-[240px] animate-in fade-in slide-in-from-left-4 duration-500">
        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-5 border-b border-gray-100 pb-2">Təsnifat Paneli</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4 group cursor-help transition-all hover:translate-x-1">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-3">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Yaşayış Binası</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Qeydiyyat</span>
            </div>
          </div>
          <div className="flex items-center gap-4 group cursor-help transition-all hover:translate-x-1">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:-rotate-3">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-red-700 uppercase tracking-tight">Tibbi Müəssisə</span>
              <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest">Operativ</span>
            </div>
          </div>
          <div className="flex items-center gap-4 group cursor-help transition-all hover:translate-x-1">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-emerald-800 group-hover:text-white transition-all transform group-hover:rotate-3">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-emerald-900 uppercase tracking-tight">Polis Şöbəsi</span>
              <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Təhlükəsizlik</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 group hover:translate-x-1 transition-all">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl">
                 <Navigation className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Seçilmiş Obyekt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
