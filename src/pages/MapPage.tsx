import React, { useState, useEffect, useMemo } from "react";
import { MapComponent } from "../components/MapComponent";
import { Sidebar } from "../components/Sidebar";
import { Building, PoliceOfficer } from "../types";
import { mockBuildings } from "../data/mockData";
import { fetchBuildings } from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, WifiOff } from "lucide-react";

interface MapPageProps {
  userName?: string;
}

export const MapPage: React.FC<MapPageProps> = ({ userName }) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading]     = useState(true);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const isAdmin = userName?.toLowerCase().includes("admin") || false;

  // ── Load buildings from API (fallback to mockData if server is offline) ──
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setApiError(null);

    fetchBuildings()
      .then((data) => {
        if (!cancelled) {
          setBuildings(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Backend offline — mock data ilə davam edirik
          setBuildings(mockBuildings);
          setApiError("Backend serverinə qoşulmaq mümkün olmadı. Demo məlumatlar göstərilir.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  const currentUser = useMemo(() => {
    if (isAdmin || !userName) return null;
    let user: PoliceOfficer | null = null;
    buildings.forEach((b) => {
      if (b.type === "Police" && b.officers) {
        const found = b.officers.find((o) => o.fullName === userName);
        if (found) user = found;
      }
    });
    return user;
  }, [userName, isAdmin, buildings]);

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || null;

  const canEdit = useMemo(() => {
    if (isAdmin) return true;
    if (
      currentUser?.rank === "Sahə Rəisi" &&
      currentUser.areaOfResponsibility &&
      selectedBuilding
    ) {
      return selectedBuilding.address
        .toLowerCase()
        .includes(currentUser.areaOfResponsibility.toLowerCase());
    }
    return false;
  }, [isAdmin, currentUser, selectedBuilding]);

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuildingId(building.id);
  };

  const handleUpdateBuilding = (updatedBuilding: Building) => {
    setBuildings((prev) =>
      prev.map((b) => (b.id === updatedBuilding.id ? updatedBuilding : b))
    );
  };

  // ── Loading screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-[#003366] animate-spin" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Xəritə məlumatları yüklənir…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <div className="flex-1 relative">
        <MapComponent
          buildings={buildings}
          onBuildingSelect={handleBuildingSelect}
          selectedBuildingId={selectedBuildingId || undefined}
        />

        {/* API xəta banneri */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-[1200] bg-amber-50 border border-amber-300 text-amber-800 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold max-w-sm pointer-events-none"
            >
              <WifiOff className="w-4 h-4 shrink-0" />
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bina seçilmədikdə ipucu */}
        <AnimatePresence>
          {!selectedBuilding && !apiError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl border border-blue-100 flex items-center gap-3 pointer-events-none"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#003366]">
                Məlumatları görmək üçün xəritədə bir binanı seçin
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Sidebar
        selectedBuilding={selectedBuilding}
        isAdmin={canEdit}
        onUpdateBuilding={handleUpdateBuilding}
      />
    </div>
  );
};
