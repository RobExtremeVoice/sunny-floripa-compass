import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Waves } from "lucide-react";

// Fix default marker icon issue with bundlers
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

function createRegionIcon(region: string) {
  const color = REGION_COLORS[region] || "#0e7490";
  return L.divIcon({
    className: "custom-beach-marker",
    html: `<div style="
      background: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "><div style="
      transform: rotate(45deg);
      color: white;
      font-size: 12px;
      font-weight: bold;
    ">🏖</div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

type Beach = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  region: string;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  wave_intensity: string | null;
  difficulty_access: string | null;
};

const WAVE_LABELS: Record<string, string> = {
  calm: "Calmas",
  moderate: "Moderadas",
  strong: "Fortes",
};

// Auto-fit bounds to markers
const FitBounds = ({ beaches }: { beaches: Beach[] }) => {
  const map = useMap();
  useEffect(() => {
    const points = beaches
      .filter((b) => b.latitude && b.longitude)
      .map((b) => [b.latitude!, b.longitude!] as [number, number]);
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
    }
  }, [beaches, map]);
  return null;
};

interface BeachesMapProps {
  beaches: Beach[];
  onSelectBeach: (beach: Beach) => void;
}

const BeachesMap = ({ beaches, onSelectBeach }: BeachesMapProps) => {
  const beachesWithCoords = beaches.filter((b) => b.latitude && b.longitude);

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-card" style={{ height: 500 }}>
      <MapContainer
        center={[-27.6, -48.48]}
        zoom={11}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds beaches={beachesWithCoords} />
        {beachesWithCoords.map((beach) => (
          <Marker
            key={beach.id}
            position={[beach.latitude!, beach.longitude!]}
            icon={createRegionIcon(beach.region)}
            eventHandlers={{
              click: () => onSelectBeach(beach),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                {beach.photo_url && (
                  <img
                    src={beach.photo_url}
                    alt={beach.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                )}
                <p className="font-bold text-sm">{beach.name}</p>
                <p className="text-xs text-gray-500 mb-1">{beach.region}</p>
                {beach.wave_intensity && (
                  <p className="text-xs">
                    🌊 Ondas: {WAVE_LABELS[beach.wave_intensity] || beach.wave_intensity}
                  </p>
                )}
                <button
                  onClick={() => onSelectBeach(beach)}
                  className="mt-2 text-xs text-blue-600 hover:underline font-medium"
                >
                  Ver detalhes →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

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
