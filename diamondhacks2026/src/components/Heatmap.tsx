import { ucsdLocations, heatColor } from "../lib/ucsd-locations";

interface HeatmapProps {
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const Heatmap = ({ selectedIndex, onSelect }: HeatmapProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        UCSD Location Heatmap
      </h3>
      <div className="flex flex-col gap-1">
        {ucsdLocations.map((loc, i) => (
          <button
            key={loc.name}
            onClick={() => onSelect(i)}
            className={`flex items-center gap-2 rounded px-2 py-1.5 text-left transition-all text-sm ${
              selectedIndex === i ? "ring-2 ring-primary" : "hover:opacity-80"
            }`}
            style={{ backgroundColor: heatColor(loc.popularity) }}
          >
            <span
              className="font-medium truncate"
              style={{ color: loc.popularity > 0.6 ? "#fff" : "#1a1a2e" }}
            >
              {loc.name}
            </span>
            <span
              className="ml-auto text-xs tabular-nums shrink-0"
              style={{ color: loc.popularity > 0.6 ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)" }}
            >
              {loc.popularity.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
      {/* Legend */}
      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <span>Low</span>
        <div
          className="flex-1 h-3 rounded"
          style={{
            background: `linear-gradient(to right, ${heatColor(0)}, ${heatColor(0.25)}, ${heatColor(0.5)}, ${heatColor(0.75)}, ${heatColor(1)})`,
          }}
        />
        <span>High</span>
      </div>
    </div>
  );
};

export default Heatmap;