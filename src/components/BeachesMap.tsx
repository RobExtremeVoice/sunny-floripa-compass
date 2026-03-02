import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const REGION_COLORS: Record<string, string> = {
  Norte: "#0e7490",
  Sul: "#0f766e",
  Leste: "#1d4ed8",
  Oeste: "#b45309",
};

const WAVE_LABELS: Record<string, string> = {
  calm: "Calmas",
  moderate: "Moderadas",
  strong: "Fortes",
};

type Beach = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  region: string;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  characteristics: string[] | null;
  infrastructure: string[] | null;
  wave_intensity: string | null;
  sand_type: string | null;
  best_season: string | null;
  difficulty_access: string | null;
  length_meters: number | null;
};

interface BeachesMapProps {
  beaches: Beach[];
  onSelectBeach: (beach: Beach) => void;
}

function createIcon(region: string) {
  const color = REGION_COLORS[region] || "#0e7490";
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:26px;height:26px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:11px;">🏖</span></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -28],
  });
}

const BeachesMap = ({ beaches, onSelectBeach }: BeachesMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-27.6, -48.48],
      zoom: 11,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const markers: L.LatLng[] = [];

    beaches.forEach((beach) => {
      if (!beach.latitude || !beach.longitude) return;
      const latlng = L.latLng(beach.latitude, beach.longitude);
      markers.push(latlng);

      const marker = L.marker(latlng, { icon: createIcon(beach.region) }).addTo(map);

      const popupHtml = `
        <div style="min-width:180px;font-family:sans-serif;">
          ${beach.photo_url ? `<img src="${beach.photo_url}" alt="${beach.name}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px;" />` : ""}
          <strong style="font-size:13px;">${beach.name}</strong>
          <div style="font-size:11px;color:#666;margin:2px 0 4px;">${beach.region}</div>
          ${beach.wave_intensity ? `<div style="font-size:11px;">🌊 ${WAVE_LABELS[beach.wave_intensity] || beach.wave_intensity}</div>` : ""}
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on("click", () => {
        onSelectBeach(beach);
      });
    });

    if (markers.length > 0) {
      map.fitBounds(L.latLngBounds(markers), { padding: [30, 30] });
    }
  }, [beaches, onSelectBeach]);

  return (
    <div className="relative">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-border shadow-card" style={{ height: 500 }} />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-card border border-border">
        <p className="text-xs font-semibold text-foreground mb-1.5">Regiões</p>
        <div className="flex flex-col gap-1">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <div key={region} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground">{region}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeachesMap;
