import React from "react";
import { useSeason } from "../contexts/SeasonContext";
import { Select } from "../components/ui/select";

const SeasonSelector: React.FC = () => {
  const { currentSeason, setCurrentSeason, allSeasons } = useSeason();

  return (
    <div className="flex items-center">
      <label
        htmlFor="season-select"
        className="mr-2 text-sm font-medium text-gray-700"
      >
        Saison :
      </label>
      <Select
        id="season-select"
        value={currentSeason?.id || ""}
        onChange={(e) => {
          const selectedSeason = allSeasons.find(
            (season) => season.id === e.target.value
          );
          if (selectedSeason) {
            setCurrentSeason(selectedSeason);
          }
        }}
      >
        {allSeasons.map((season) => (
          <option key={season.id} value={season.id}>
            {season.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SeasonSelector;
