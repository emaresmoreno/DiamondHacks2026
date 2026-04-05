import {collection, getDocs} from 'firebase/firestore';
import {useState} from 'react';

import {db} from './firebase';

// replace this with fetching

// export async function fetchLocations(): Promise<UcsdLocation[]> {
//   const snapshot = await getDocs(collection(db, "locations"));
//   return snapshot.docs.map(doc => doc.data() as UcsdLocation);
// }


// for the tsx files
//  const [locations, setLocations] = useState<locations[]>([]);

// useEffect(() => {
//   fetchLocations().then(setLocations);
// }, []);

// Seeded random-ish values matching the heatmap
export interface studyspots {
  id: string;
  name: string;
  lat: number;
  lon: number;
  rating: number;
  popularity: number;
  sound: number;
  freeTimeOfDay: string;
  hasOutlets: boolean;
  isAccessible: boolean;
  features: string[];
}

export const ucsdLocations: studyspots[] = [
  {
    id: "geisel-l1",
    name: "Geisel Library L1",
    lat: 32.8812,
    lon: -117.2375,
    rating: 4.2,
    popularity: 0.62,
    sound: 0.6,
    freeTimeOfDay: "morning",
    hasOutlets: true,
    isAccessible: true,
    features: ["open late", "group study", "spacious"]
  },
  {
    id: "geisel-l2",
    name: "Geisel Library L2",
    lat: 32.8812,
    lon: -117.2375,
    rating: 4.5,
    popularity: 0.2,
    sound: 0.2,
    freeTimeOfDay: "morning",
    hasOutlets: true,
    isAccessible: true,
    features: ["individual study", "good lighting", "focused"]
  },
  {
    id: "geisel-l4",
    name: "Geisel Library L4",
    lat: 32.8812,
    lon: -117.2375,
    rating: 4.8,
    popularity: 0.9,
    sound: 0.1,
    freeTimeOfDay: "all day",
    hasOutlets: true,
    isAccessible: true,
    features: ["focused work", "best views", "modern design"]
  },
  {
    id: "price-center",
    name: "Price Center",
    lat: 32.8798,
    lon: -117.2362,
    rating: 4.0,
    popularity: 0.48,
    sound: 0.8,
    freeTimeOfDay: "all day",
    hasOutlets: false,
    isAccessible: true,
    features: ["food nearby", "group friendly", "bustling"]
  },
  {
    id: "mom-cafe",
    name: "MOM Cafe",
    lat: 32.8785,
    lon: -117.2401,
    rating: 4.3,
    popularity: 0.55,
    sound: 0.5,
    freeTimeOfDay: "morning",
    hasOutlets: true,
    isAccessible: true,
    features: ["coffee", "cozy", "limited seating"]
  },
  {
    id: "muir-college",
    name: "Muir College",
    lat: 32.8790,
    lon: -117.2415,
    rating: 4.1,
    popularity: 0.37,
    sound: 0.4,
    freeTimeOfDay: "afternoon",
    hasOutlets: false,
    isAccessible: true,
    features: ["outdoor seating", "chill vibe", "green space"]
  },
  {
    id: "revelle-college",
    name: "Revelle College",
    lat: 32.8743,
    lon: -117.2410,
    rating: 4.4,
    popularity: 0.71,
    sound: 0.6,
    freeTimeOfDay: "all day",
    hasOutlets: true,
    isAccessible: true,
    features: ["spacious", "group study", "modern design"]
  },
  {
    id: "hopkins",
    name: "Hopkins",
    lat: 32.8840,
    lon: -117.2398,
    rating: 3.9,
    popularity: 0.44,
    sound: 0.7,
    freeTimeOfDay: "all day",
    hasOutlets: false,
    isAccessible: true,
    features: ["cafeteria", "food nearby"]
  },
  {
    id: "jacobs",
    name: "Jacobs School of Engineering",
    lat: 32.8822,
    lon: -117.2338,
    rating: 4.6,
    popularity: 0.83,
    sound: 0.3,
    freeTimeOfDay: "daytime",
    hasOutlets: true,
    isAccessible: true,
    features: ["modern", "tech-friendly", "study pods"]
  },
  {
    id: "antonio-hall",
    name: "Franklin Antonio Hall",
    lat: 32.8819,
    lon: -117.2330,
    rating: 4.2,
    popularity: 0.29,
    sound: 0.3,
    freeTimeOfDay: "daytime",
    hasOutlets: true,
    isAccessible: true,
    features: ["new building", "good lighting", "open areas"]
  },
  {
    id: "pinpoint-cafe",
    name: "Pinpoint Cafe",
    lat: 32.8775,
    lon: -117.2350,
    rating: 4.3,
    popularity: 0.58,
    sound: 0.5,
    freeTimeOfDay: "all day",
    hasOutlets: true,
    isAccessible: true,
    features: ["coffee", "casual", "cozy atmosphere"]
  },
  {
    id: "gliderport",
    name: "Torrey Pines Gliderport",
    lat: 32.8893,
    lon: -117.2510,
    rating: 4.9,
    popularity: 0.91,
    sound: 0.4,
    freeTimeOfDay: "daytime",
    hasOutlets: false,
    isAccessible: true,
    features: ["outdoors", "scenic", "windy"]
  }
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