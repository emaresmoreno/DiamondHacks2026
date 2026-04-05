import { MapPin } from "lucide-react";
import { Card } from "./ui/card";
import type { LocationResult } from "../lib/nominatim";

interface LocationListProps {
    locations: LocationResult[];
    selectedId: number | null;
    onSelect: (location: LocationResult) => void;
    pinColors?: Record<number, string>;
}

const LocationList = ({ locations, selectedId, onSelect, pinColors }: LocationListProps) => {
    if (locations.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
            {locations.map((loc) => (
                <Card
                    key={loc.place_id}
                    onClick={() => onSelect(loc)}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedId === loc.place_id
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-secondary/50"
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <MapPin
                            className="w-5 h-5 mt-0.5 shrink-0"
                            style={{ color: pinColors?.[loc.place_id] ?? (selectedId === loc.place_id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))") }}
                        />
                        <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{loc.display_name.split(",")[0]}</p>
                            <p className="text-sm text-muted-foreground truncate">{loc.display_name}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default LocationList;