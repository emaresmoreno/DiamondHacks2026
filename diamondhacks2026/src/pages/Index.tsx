import { useState } from "react";
import { MapPin } from "lucide-react";

import { useToast } from "../hooks/use-toast";
import { heatColor } from "../lib/ucsd-locations";
// 1. Point to your updated function and type
import { searchLocations } from "../lib/search-results";
import type { studyspots } from "../lib/ucsd-locations"; 

import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import LocationList from "../components/LocationList";

const Index = () => {
  // 2. State is now powered purely by your clean Location type!
  const [locations, setLocations] = useState<studyspots[]>([]);
  const [selected, setSelected] = useState<studyspots | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  // 3. Pin colors map directly to location names now
  const pinColors: Record<string, string> = {};
  locations.forEach((loc) => {
    pinColors[loc.name] = heatColor(loc.popularity);
  });

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;

    setIsLoading(true);
    setQuery(q);
    try {
      const results = await searchLocations(q);
      setLocations(results);
      setSelected(results[0] || null);

      if (results.length === 0) {
        toast({ title: "No results", description: "Try different keywords." });
      }
    } catch {
      toast({ title: "Error", description: "Failed to search. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">PlaceFinder</h1>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Results List */}
        <div className="lg:col-span-1 flex flex-col h-[calc(100vh-140px)]">
          {query && (
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              {locations.length} result{locations.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </h2>
          )}

          <div className="overflow-y-auto flex-1">
            <LocationList
              locations={locations}
              selectedId={selected?.name ?? null} // Using name as the unique key now
              onSelect={setSelected}
              pinColors={pinColors}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Permanent Large Map */}
        <div className="lg:col-span-2 h-[calc(100vh-140px)] sticky top-[80px]">
          <MapView
            lat={selected ? String(selected.lat) : undefined}
            lon={selected ? String(selected.lon) : undefined}
            query={query}
            // Passing the raw locations directly to MapView for heatmap rendering
            locations={locations}
          />
        </div>

      </main>
    </div>
  );
};

export default Index;