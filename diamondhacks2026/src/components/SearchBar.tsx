import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for places, cities, landmarks..."
        className="h-12 text-base bg-card shadow-sm"
      />
      <Button type="submit" disabled={isLoading || !query.trim()} size="lg" className="h-12 px-6">
        <Search className="w-4 h-4 mr-2" />
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
};

export default SearchBar;