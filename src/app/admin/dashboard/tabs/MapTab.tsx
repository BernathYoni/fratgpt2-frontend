import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card } from '@/app/components/ui/Card';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { motion } from 'framer-motion';

// US Map TopoJSON
const US_GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface Activity {
  id: string;
  lat: number;
  lng: number;
  location: string;
  mode: string;
  timestamp: string;
}

const isRecent = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  return diff < 30000; // 30 seconds
};

export default function MapTab() {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  const fetchData = async () => {
    const token = getToken();
    if (!token) return;
    
    try {
      const res = await api.getMapActivity(token);
      if (res.success && res.data) {
        setActivities(res.data.activity);
      }
    } catch (err) {
      console.error('Failed to fetch map activity:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-0 overflow-hidden bg-slate-900 border-slate-800 h-[600px] relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-800">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Live Activity
        </h3>
        <p className="text-slate-400 text-xs mt-1">Real-time solves across the US</p>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-slate-950">
        <ComposableMap projection="geoAlbersUsa" className="w-full h-full max-w-4xl">
          <Geographies geography={US_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth={0.5}
                  style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#334155" },
                      pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          
          {activities.map((act) => (
            <Marker key={act.id} coordinates={[act.lng, act.lat]}>
              <circle r={3} fill="#ef4444" stroke="#fff" strokeWidth={1} />
              {isRecent(act.timestamp) && (
                <motion.circle
                    initial={{ r: 3, opacity: 1, strokeWidth: 2 }}
                    animate={{ r: 20, opacity: 0, strokeWidth: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    fill="none"
                    stroke="#ef4444"
                />
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </Card>
  );
}
