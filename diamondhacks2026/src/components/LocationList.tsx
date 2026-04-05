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
                            ? "ring-2 ring-primary bg-primary/5"
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
                            {/* Main title: just the location name */}
                            <p className="font-medium text-foreground truncate">{loc.name}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default LocationList;