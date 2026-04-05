import type {studyspots} from './ucsd-locations';
import {fetchLocations} from './ucsd-locations';
import React, { useEffect, useState } from 'react';

export interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  category: string;
  importance: number;
  address?: {road?: string; city?: string; state?: string; country?: string;};
}

let cachedSpots: studyspots[] | null = null;

export async function searchLocations(query: string): Promise<studyspots[]> {
  // 1. Only go to the "store" (Firebase) if the "fridge" (cache) is empty
  if (!cachedSpots) {
    console.log("Fetching from Firebase...");
    cachedSpots = await fetchLocations();
  } else {
    console.log("Using cached data - instant results!");
  }

  // 2. Search the local list (always works, even if you search 100 times)
  const queryLower = query.toLowerCase();
  return cachedSpots.filter(loc => 
    loc.name.toLowerCase().includes(queryLower)
  );
}
// open source library for search real locations, we replace this file with
// searching the database
// export async function searchLocations(query: string): Promise<studyspots[]> {
//   const queryLower = query.toLowerCase();
//   return ucsdLocations.filter(
//       (loc) => loc.name.toLowerCase().includes(queryLower));
// }
// export async function searchLocations(query: string):
// Promise<LocationResult[]> {
//   const res = await fetch(
//     `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10`,
//     { headers: { "Accept-Language": "en" } }
//   );
//   if (!res.ok) throw new Error("Search failed");
//   return res.json();
// }