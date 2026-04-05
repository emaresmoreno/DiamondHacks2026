import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {useState} from 'react';

//replace this with fetching

export interface locations {
//   id: string;
  name: string;
  lat: number;
  lon: number;
  popularity: number;
//   sound: number;
//   features: string[]
}

// export async function fetchLocations(): Promise<UcsdLocation[]> {
//   const snapshot = await getDocs(collection(db, "locations"));
//   return snapshot.docs.map(doc => doc.data() as UcsdLocation);
// }


//for the tsx files
// const [locations, setLocations] = useState<locations[]>([]);

// useEffect(() => {
//   fetchLocations().then(setLocations);
// }, []);

// Seeded random-ish values matching the heatmap
export const ucsdLocations: locations[] = [
  {name: 'Geisel Library', lat: 32.8812, lon: -117.2375, popularity: 0.62},
  {name: 'Price Center', lat: 32.8798, lon: -117.2362, popularity: 0.48},
  {name: 'MOM Cafe', lat: 32.8785, lon: -117.2401, popularity: 0.55},
  {name: 'Muir College', lat: 32.8790, lon: -117.2415, popularity: 0.37},
  {name: 'Revelle College', lat: 32.8743, lon: -117.2410, popularity: 0.71},
  {name: 'WongAvery Library', lat: 32.8840, lon: -117.2398, popularity: 0.44},
  {
    name: 'Jacobs School of Engineering',
    lat: 32.8822,
    lon: -117.2338,
    popularity: 0.83
  },
  {
    name: 'Franklin Antonio Hall',
    lat: 32.8819,
    lon: -117.2330,
    popularity: 0.29
  },
  {name: 'Pinpoint Cafe', lat: 32.8775, lon: -117.2350, popularity: 0.58},
  {
    name: 'Torrey Pines Gliderport',
    lat: 32.8893,
    lon: -117.2510,
    popularity: 0.91
  },
];

/**
 * Interpolate from light yellow (#ffffcc) to dark blue (#225ea8) matching
 * YlGnBu colormap. value should be 0–1.
 */
export function heatColor(value: number): string {
  const stops = [
    {p: 0, r: 255, g: 255, b: 204},     // #ffffcc
    {p: 0.25, r: 161, g: 218, b: 180},  // #a1dab4
    {p: 0.5, r: 65, g: 182, b: 196},    // #41b6c4
    {p: 0.75, r: 44, g: 127, b: 184},   // #2c7fb8
    {p: 1, r: 34, g: 94, b: 168},       // #225ea8
  ];

  const v = Math.max(0, Math.min(1, value));
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i].p && v <= stops[i + 1].p) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const t = hi.p === lo.p ? 0 : (v - lo.p) / (hi.p - lo.p);
  const r = Math.round(lo.r + t * (hi.r - lo.r));
  const g = Math.round(lo.g + t * (hi.g - lo.g));
  const b = Math.round(lo.b + t * (hi.b - lo.b));
  return `rgb(${r},${g},${b})`;
}