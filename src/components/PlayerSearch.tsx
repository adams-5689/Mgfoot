import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";

interface PlayerSearchProps {
  onSearch: (query: string) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
      <Input
        type="text"
        placeholder="Rechercher un joueur..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" variant="outline">
        <Search className="h-4 w-4 mr-2" />
        Rechercher
      </Button>
    </form>
  );
};

export default PlayerSearch;
