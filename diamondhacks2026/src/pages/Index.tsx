import { useState, useEffect} from "react";
import { MapPin } from "lucide-react";

import { useToast } from "../hooks/use-toast";
import { heatColor } from "../lib/ucsd-locations";
// 1. Point to your updated function and type
import { searchLocations } from "../lib/search-results";
import type { studyspots } from "../lib/ucsd-locations";

import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import LocationList from "../components/LocationList";
import { Plus, X } from "lucide-react";
import VideoInsertionPage from "./VideoInsertionPage";
import * as Dialog from "@radix-ui/react-dialog";


const Index = () => {
  const [currentCoords, setCurrentCoords] = useState({ lat: 40.7128, lng: -74.0060 });
  const [locations, setLocations] = useState<studyspots[]>([]);
  const [selected, setSelected] = useState<studyspots | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.log("Permission denied. Using default UCSD location.");
        console.error(err);
      }
    );
  }, []);

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
            <h1 className="text-xl font-bold text-foreground">Where2Study</h1>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="your-radial-button-class p-3 rounded-full hover:scale-110 transition-transform shadow-lg">
                <Plus className="w-6 h-6 text-black your-radial-plus-class" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              {/* The Dimmed Overlay */}
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />

              {/* The Modal Content */}
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[101] w-[95vw] max-w-lg overflow-hidden border border-gray-100">

                {/* Header inside the popup */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                  <Dialog.Title className="text-lg font-semibold">Add New Study Spot</Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="p-1 hover:bg-gray-200 rounded-full transition">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* YOUR VIDEO COMPONENT GOES HERE */}
                <div className="p-0">
                  <VideoInsertionPage lat={currentCoords.lat} lng={currentCoords.lng} />
</div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        
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
            locations={locations}
            // Add this line to force a zoom scale when an item is selected
            zoom={selected ? 17 : 14}
            selectedId={selected?.name ?? ""}
          />
        </div>

      </main>
    </div>
  );
};

export default Index;