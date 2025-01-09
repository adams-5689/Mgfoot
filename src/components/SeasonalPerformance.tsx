import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { useSeason } from "../contexts/SeasonContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Select } from "../components/ui/select";

interface Performance {
  id: string;
  playerId: string;
  playerName: string;
  seasonId: string;
  goalsScored: number;
  assists: number;
  matchesPlayed: number;
}

const SeasonalPerformance: React.FC = () => {
  const { currentSeason, allSeasons } = useSeason();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(currentSeason?.id || "");

  useEffect(() => {
    if (selectedSeason) {
      fetchPerformances(selectedSeason);
    }
  }, [selectedSeason]);

  const fetchPerformances = async (seasonId: string) => {
    const q = query(
      collection(db, "performances"),
      where("seasonId", "==", seasonId)
    );
    const querySnapshot = await getDocs(q);
    const fetchedPerformances: Performance[] = [];
    querySnapshot.forEach((doc) => {
      fetchedPerformances.push({ id: doc.id, ...doc.data() } as Performance);
    });
    setPerformances(fetchedPerformances);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Performances par saison</h2>
      <Select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
      >
        {allSeasons.map((season) => (
          <option key={season.id} value={season.id}>
            {season.name}
          </option>
        ))}
      </Select>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Joueur</TableHead>
            <TableHead>Buts</TableHead>
            <TableHead>Passes décisives</TableHead>
            <TableHead>Matchs joués</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performances.map((performance) => (
            <TableRow key={performance.id}>
              <TableCell>{performance.playerName}</TableCell>
              <TableCell>{performance.goalsScored}</TableCell>
              <TableCell>{performance.assists}</TableCell>
              <TableCell>{performance.matchesPlayed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SeasonalPerformance;
