import { useState } from "react";
import { MapPin } from "lucide-react";

import { useToast } from "../hooks/use-toast";
import { searchLocations, type LocationResult } from "../lib/nominatim";
import { ucsdLocations, heatColor } from "../lib/ucsd-locations";

import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import LocationList from "../components/LocationList";


const Index = () => {
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [selected, setSelected] = useState<LocationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [heatmapSelected, setHeatmapSelected] = useState<number | null>(null);
  const { toast } = useToast();

  // Map place_id → heat color for locations that match UCSD names
  const pinColors: Record<number, string> = {};
  locations.forEach((loc) => {
    const name = loc.display_name.split(",")[0].trim();
    const ucsd = ucsdLocations.find(
      (u) => name.toLowerCase().includes(u.name.toLowerCase()) || u.name.toLowerCase().includes(name.toLowerCase())
    );
    if (ucsd) {
      pinColors[loc.place_id] = heatColor(ucsd.popularity);
    }
  });

  const handleSearch = async (q: string) => {
    setIsLoading(true);
    setQuery(q);
    setHeatmapSelected(null);
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

  const handleHeatmapSelect = (index: number) => {
    const loc = ucsdLocations[index];
    setHeatmapSelected(index);
    // Create a synthetic LocationResult so the map navigates
    const synth: LocationResult = {
      place_id: -(index + 1),
      display_name: loc.name + ", UCSD, La Jolla, CA",
      lat: String(loc.lat),
      lon: String(loc.lon),
      type: "university",
      category: "education",
      importance: loc.popularity,
    };
    setSelected(synth);
    // Also update location list to show UCSD locations
    if (locations.length === 0 || query === "") {
      setLocations(
        ucsdLocations.map((u, i) => ({
          place_id: -(i + 1),
          display_name: u.name + ", UCSD, La Jolla, CA",
          lat: String(u.lat),
          lon: String(u.lon),
          type: "university",
          category: "education",
          importance: u.popularity,
        }))
      );
      setQuery("UCSD");
    }
  };

  // Build pinColors for synthetic UCSD entries too
  ucsdLocations.forEach((u, i) => {
    pinColors[-(i + 1)] = heatColor(u.popularity);
  });

  return (
    <div className="min-h-screen bg-background">
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
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {locations.length === 0 && !isLoading ? (
            <div className="lg:col-span-3">
              <MapView
                onHeatmapSelect={handleHeatmapSelect}
                heatmapSelectedIndex={heatmapSelected}
                lat={selected?.lat}
                lon={selected?.lon}
                query={query}
              />
            </div>
          ) : (
            <>
              <div className="lg:col-span-1">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  {locations.length} result{locations.length !== 1 ? "s" : ""} for &quot;{query}&quot;
                </h2>
                <LocationList
                  locations={locations}
                  selectedId={selected?.place_id ?? null}
                  onSelect={setSelected}
                  pinColors={pinColors}
                />
              </div>
              <div className="lg:col-span-2">
                <MapView
                  lat={selected?.lat}
                  lon={selected?.lon}
                  query={query}
                  onHeatmapSelect={handleHeatmapSelect}
                  heatmapSelectedIndex={heatmapSelected}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;