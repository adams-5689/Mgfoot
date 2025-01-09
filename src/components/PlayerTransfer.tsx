import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useSeason } from "../contexts/SeasonContext";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "../components/ui/use-toast";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  currentTeamId: string;
}

interface Team {
  id: string;
  name: string;
  seasonId: string;
}

const PlayerTransfer: React.FC = () => {
  const { currentSeason } = useSeason();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentSeason) {
      fetchPlayers();
      fetchTeams();
    }
  }, [currentSeason]);

  const fetchPlayers = async () => {
    if (!currentSeason) return;
    const q = query(
      collection(db, "players"),
      where("seasonId", "==", currentSeason.id)
    );
    const querySnapshot = await getDocs(q);
    const fetchedPlayers: Player[] = [];
    querySnapshot.forEach((doc) => {
      fetchedPlayers.push({ id: doc.id, ...doc.data() } as Player);
    });
    setPlayers(fetchedPlayers);
  };

  const fetchTeams = async () => {
    if (!currentSeason) return;
    const q = query(
      collection(db, "teams"),
      where("seasonId", "==", currentSeason.id)
    );
    const querySnapshot = await getDocs(q);
    const fetchedTeams: Team[] = [];
    querySnapshot.forEach((doc) => {
      fetchedTeams.push({ id: doc.id, ...doc.data() } as Team);
    });
    setTeams(fetchedTeams);
  };

  const handleTransfer = async () => {
    if (!selectedPlayer || !selectedTeam) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un joueur et une équipe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "players", selectedPlayer), {
        currentTeamId: selectedTeam,
      });

      toast({
        title: "Succès",
        description: "Le transfert a été effectué avec succès.",
      });

      setSelectedPlayer("");
      setSelectedTeam("");
      fetchPlayers();
    } catch (error) {
      console.error("Erreur lors du transfert:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du transfert.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transfert de joueur</h2>
      <div>
        <Select
          value={selectedPlayer}
          onValueChange={(value) => setSelectedPlayer(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un joueur" />
          </SelectTrigger>
          <SelectContent>
            {players.map((player) => (
              <SelectItem key={player.id} value={player.id}>
                {player.firstName} {player.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select
          value={selectedTeam}
          onValueChange={(value) => setSelectedTeam(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleTransfer} disabled={loading}>
        {loading ? "Transfert en cours..." : "Effectuer le transfert"}
      </Button>
    </div>
  );
};

export default PlayerTransfer;
