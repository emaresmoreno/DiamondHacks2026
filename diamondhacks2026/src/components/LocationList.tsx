import { MapPin } from "lucide-react";
import { Card } from "./ui/card";
// 1. Import your custom Location type instead of LocationResult
import type { studyspots } from "../lib/ucsd-locations";

interface LocationListProps {
    locations: studyspots[];
    selectedId: string | null;
    onSelect: (location: studyspots) => void;
    pinColors?: Record<string, string>;
}

const getPopularityLabel = (value: number) => {
  if (value >= 0.7) return "Crowded";
  if (value >= 0.4) return "Moderate";
  return "Empty";
};

// Converts 0.0 - 1.0 into a sound description
const getSoundLabel = (value: number) => {
  if (value >= 0.7) return "Loud";
  if (value >= 0.4) return "Moderate";
  return "Silent";
};

function RatingCircle({ value }: { value: number }) {
    const val = Math.max(0, Math.min(1, value));
    const hue = 10 + (val * 170);
    const saturation = 90 - (val * 30);
    const lightness = 45 + (val * 20);

    const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    return (
        <div
            style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "black",
                fontSize: 9,
                flexShrink: 0,
                border: `3px solid ${bgColor}`,
                boxShadow: "0 0 4px rgba(0,0,0,0.3)",
            }}
        >
            {value}
        </div>
    );
}

const LocationList = ({ locations, selectedId, onSelect, pinColors }: LocationListProps) => {
    if (locations.length === 0) return null;

    return (
        // Note: Removed max-h-[60vh] because we gave the parent container in index.ts a strict height.
        // This lets the column fill the space perfectly without arbitrary pixel cutoffs!
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {locations.map((loc) => (
                <Card
                    key={loc.name} // Using loc.name as the unique key
                    onClick={() => onSelect(loc)}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedId === loc.name
                        ? "bg-gray-200 ring-2 ring-primary"
                        : "hover:bg-secondary/50"
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <MapPin
                            className="w-5 h-5 mt-0.5 shrink-0"
                            style={{
                                color: pinColors?.[loc.name] ??
                                    (selectedId === loc.name ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))")
                            }}
                        />
                        <div className="min-w-0">
                            <p className="font-medium text-foreground">{loc.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {loc.features.join(" • ")}
                            </p>
                            <br/>
                            {selectedId === loc.name && (
                                <p className="text-xs text-muted-foreground">Sound Level: {getSoundLabel(loc.sound)}</p>
                            )}
                            {selectedId === loc.name && (
                                <p className="text-xs text-muted-foreground">Popularity: {getPopularityLabel(loc.popularity)}</p>
                            )}
                        </div>
                        <div className="flex-shrink-0 ml-auto"><RatingCircle value={loc.rating} /></div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default LocationList;