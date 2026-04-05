export interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  category: string;
  importance: number;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

//open source library for search real locations, we replace this file with searching the database

export async function searchLocations(query: string): Promise<LocationResult[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10`,
    { headers: { "Accept-Language": "en" } }
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}