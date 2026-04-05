import { useState } from "react";
import type {studyspots}  from "../lib/ucsd-locations";
import { ucsdLocations, heatColor } from "../lib/ucsd-locations";

interface MapViewProps {
    lat?: string;
    lon?: string;
    query?: string;
    locations: studyspots[];
}

// UCSD campus bounding box for positioning overlay markers
// change bounds as we want to zoom in and out
const UCSD_BOUNDS = {
    minLat: 32.8700,
    maxLat: 32.8920,
    minLon: -117.2550,
    maxLon: -117.2280,
};

function getLatLonBounds(ucsdLocations: { lat: number, lon: number }[]) {
    if (ucsdLocations.length === 0) {
        //default to UCSD campus bounds
        return UCSD_BOUNDS;
    }

    const lats = ucsdLocations.map((l) => l.lat);
    const lons = ucsdLocations.map((l) => l.lon);

    return {
        minLat: Math.min(...lats),
        maxLat: Math.max(...lats),
        minLon: Math.min(...lons),
        maxLon: Math.max(...lons),
    };
}

const UCSD_CENTER = { lat: 32.8801, lon: -117.2375 };

function getCenter(bounds: {  minLat: number; maxLat: number; minLon: number; maxLon: number }) {
    return {
        lat: (bounds.minLat + bounds.maxLat) / 2,
        lon: (bounds.minLon + bounds.maxLon) / 2,
    };
}

function latLonToPercent(lat: number, lon: number) {
    const BOUNDS = getLatLonBounds(ucsdLocations);
    const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
    const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

const MapView = ({ lat, lon, query, locations }: MapViewProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const CENTER = getCenter(getLatLonBounds(ucsdLocations));
    // Always show UCSD area as base, zoom to selected if available
    const centerLat = lat ? Number(lat) : CENTER.lat;
    const centerLon = lon ? Number(lon) : CENTER.lon;
    const zoom = lat && lon ? 0.01 : 0.015;

    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLon - zoom * 1.5},${centerLat - zoom},${centerLon + zoom * 1.5},${centerLat + zoom}&layer=mapnik${lat && lon ? `&marker=${lat},${lon}` : ""}`;

    const showOverlay = !!query && query.length > 0;

    return (
        <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-border shadow-sm bg-muted">
            <iframe
                src={src}
                width="100%"
                height="100%"
                className="min-h-[300px] lg:min-h-[500px]"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                title="Map"
            />

            {/*
            {showOverlay && (
                <div className="absolute inset-0 pointer-events-none">
                    {ucsdLocations.map((loc: any, i: number) => {
                        const pos = latLonToPercent(loc.lat, loc.lon);
                        const isSelected = heatmapSelectedIndex === i;
                        const isHovered = hoveredIndex === i;
                        const size = isSelected ? 20 : isHovered ? 18 : 14;

                        return (
                            <button
                                key={loc.name}
                                onClick={() => onHeatmapSelect?.(i)}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="absolute pointer-events-auto transition-all duration-200 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg cursor-pointer z-10"
                                style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                    width: size,
                                    height: size,
                                    backgroundColor: heatColor(loc.popularity),
                                    boxShadow: isSelected
                                        ? `0 0 0 3px hsl(var(--primary)), 0 2px 8px rgba(0,0,0,0.3)`
                                        : `0 2px 6px rgba(0,0,0,0.3)`,
                                }}
                                title={`${loc.name} (${loc.popularity.toFixed(2)})`}
                            />
                        );
                    })}

                    {hoveredIndex !== null && (
                        <div
                            className="absolute z-20 pointer-events-none bg-card text-card-foreground text-xs font-medium px-2 py-1 rounded shadow-md border border-border whitespace-nowrap -translate-x-1/2"
                            style={{
                                left: `${latLonToPercent(ucsdLocations[hoveredIndex].lat, ucsdLocations[hoveredIndex].lon).x}%`,
                                top: `${latLonToPercent(ucsdLocations[hoveredIndex].lat, ucsdLocations[hoveredIndex].lon).y - 4}%`,
                            }}
                        >
                            <span
                                className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                                style={{ backgroundColor: heatColor(ucsdLocations[hoveredIndex].popularity) }}
                            />
                            {ucsdLocations[hoveredIndex].name}
                            <span className="ml-1 text-muted-foreground">
                                {ucsdLocations[hoveredIndex].popularity.toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            )}
                
            {showOverlay && (
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-xs bg-card/90 backdrop-blur-sm text-muted-foreground px-2 py-1 rounded border border-border shadow-sm">
                    <span>Low</span>
                    <div
                        className="w-16 h-2.5 rounded"
                        style={{
                            background: `linear-gradient(to right, ${heatColor(0)}, ${heatColor(0.25)}, ${heatColor(0.5)}, ${heatColor(0.75)}, ${heatColor(1)})`,
                        }}
                    />
                    <span>High</span>
                </div>
            )} */}
        </div>
    );
};

export default MapView;