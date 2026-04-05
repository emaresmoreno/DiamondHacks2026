import { useEffect, useState } from "react";
import type { studyspots } from "../lib/ucsd-locations";
import { heatColor } from "../lib/ucsd-locations";
// 1. Import the React-Leaflet building blocks
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default Leaflet marker icons not showing up correctly in React/Vite
import "leaflet/dist/leaflet.css";
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  lat?: string;
  lon?: string;
  query?: string;
  locations: studyspots[];
  zoom?: number;
  selectedId: string;
}

// Default to the center of UCSD campus (Geisel Library area)
const UCSD_CENTER: [number, number] = [32.8801, -117.2375];

// 2. Camera controller to handle panning and zooming smoothly
function MapController({ lat, lon, zoom }: { lat?: string; lon?: string; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lon) {
      map.flyTo([parseFloat(lat), parseFloat(lon)], zoom, {
        duration: 1.5, // 1.5 seconds smooth transition
      });
    }
  }, [lat, lon, zoom, map]);

  return null;
}

const MapView = ({ lat, lon, query, locations, zoom = 15, selectedId }: MapViewProps) => {
  // Determine if we should automatically zoom in on a selection
  const currentZoom = lat && lon ? 18 : zoom;
  const center: [number, number] = lat && lon ? [parseFloat(lat), parseFloat(lon)] : UCSD_CENTER;
  const sortedLocations = [...locations].sort((a, b) => {
    if (a.name === selectedId) return 1;  // Move 'a' to the end
    if (b.name === selectedId) return -1; // Move 'b' to the end
    return 0; // Keep everything else in its original order
  });
  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-border shadow-sm bg-muted">

      {/* 3. The Interactive Map Container */}
      <MapContainer
        center={center}
        zoom={currentZoom}
        className="w-full h-full min-h-[300px] lg:min-h-[500px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* This handles smooth "fly to" animations when a user clicks the sidebar */}
        <MapController lat={lat} lon={lon} zoom={currentZoom} />


        {/* 4. Render markers dynamically from your searched locations array */}
        {sortedLocations.map((loc) => {
          // Generate a dynamic color for the pin based on its popularity!
          const pinColor = heatColor(loc.popularity);

          const customSvgIcon = L.divIcon({
            className: "custom-div-icon",
            html: `
              <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C6.71 0 0 6.71 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71 23.29 0 15 0Z" fill="white"/>
                <path d="M15 2C7.82 2 2 7.82 2 15C2 24.5 15 38.5 15 38.5C15 38.5 28 24.5 28 15C28 7.82 22.18 2 15 2Z" fill="${pinColor}"/>
                <circle cx="15" cy="15" r="5" fill="white"/>
              </svg>
            `,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -42],
          });
          return (
            <Marker
              key={loc.name}
              position={[loc.lat, loc.lon]}
              icon={customSvgIcon}
              ref={(markerRef) => {
                if (markerRef && lat && parseFloat(lat) === loc.lat) {
                  markerRef.openPopup();
                }
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-slate-800">{loc.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">Popularity Rank: {loc.popularity}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;

// import { useState } from "react";
// import type {studyspots}  from "../lib/ucsd-locations";
// import { ucsdLocations, heatColor } from "../lib/ucsd-locations";

// interface MapViewProps {
//     lat?: string;
//     lon?: string;
//     query?: string;
//     locations: studyspots[];
// }

// // UCSD campus bounding box for positioning overlay markers
// // change bounds as we want to zoom in and out
// const UCSD_BOUNDS = {
//     minLat: 32.8700,
//     maxLat: 32.8920,
//     minLon: -117.2550,
//     maxLon: -117.2280,
// };

// function getLatLonBounds(ucsdLocations: { lat: number, lon: number }[]) {
//     if (ucsdLocations.length === 0) {
//         //default to UCSD campus bounds
//         return UCSD_BOUNDS;
//     }

//     const lats = ucsdLocations.map((l) => l.lat);
//     const lons = ucsdLocations.map((l) => l.lon);

//     return {
//         minLat: Math.min(...lats),
//         maxLat: Math.max(...lats),
//         minLon: Math.min(...lons),
//         maxLon: Math.max(...lons),
//     };
// }

// const UCSD_CENTER = { lat: 32.8801, lon: -117.2375 };

// function getCenter(bounds: {  minLat: number; maxLat: number; minLon: number; maxLon: number }) {
//     return {
//         lat: (bounds.minLat + bounds.maxLat) / 2,
//         lon: (bounds.minLon + bounds.maxLon) / 2,
//     };
// }

// function latLonToPercent(lat: number, lon: number) {
//     const BOUNDS = getLatLonBounds(ucsdLocations);
//     const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
//     const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
//     return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
// }

// const MapView = ({ lat, lon, query, locations }: MapViewProps) => {
//     const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//     const CENTER = getCenter(getLatLonBounds(ucsdLocations));
//     // Always show UCSD area as base, zoom to selected if available
//     const centerLat = lat ? Number(lat) : CENTER.lat;
//     const centerLon = lon ? Number(lon) : CENTER.lon;
//     const zoom = lat && lon ? 0.01 : 0.015;

//     const src = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLon - zoom * 1.5},${centerLat - zoom},${centerLon + zoom * 1.5},${centerLat + zoom}&layer=mapnik${lat && lon ? `&marker=${lat},${lon}` : ""}`;

//     const showOverlay = !!query && query.length > 0;

//     return (
//         <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-border shadow-sm bg-muted">
//             <iframe
//                 src={src}
//                 width="100%"
//                 height="100%"
//                 className="min-h-[300px] lg:min-h-[500px]"
//                 style={{ border: 0 }}
//                 loading="lazy"
//                 allowFullScreen
//                 title="Map"
//             />
//         </div>
//     );
// };

// export default MapView;