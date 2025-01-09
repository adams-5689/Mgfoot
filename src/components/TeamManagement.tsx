import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useSeason } from "../contexts/SeasonContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Team {
  id: string;
  name: string;
  seasonId: string;
  players: {
    starters: string[];
    substitutes: string[];
  };
}

interface Player {
  id: string;
  name: string;
}

interface Season {
  id: string;
  name: string;
}

const TeamManagement: React.FC = () => {
  const { currentSeason } = useSeason();
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedStarters, setSelectedStarters] = useState<string[]>([]);
  const [selectedSubstitutes, setSelectedSubstitutes] = useState<string[]>([]);

  useEffect(() => {
    if (currentSeason) {
      fetchTeams();
      fetchPlayers();
    }
  }, [currentSeason]);

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

  const fetchPlayers = async () => {
    const querySnapshot = await getDocs(collection(db, "players"));
    const fetchedPlayers: Player[] = [];
    querySnapshot.forEach((doc) => {
      fetchedPlayers.push({ id: doc.id, ...doc.data() } as Player);
    });
    setPlayers(fetchedPlayers);
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeason) return;
    await addDoc(collection(db, "teams"), {
      name: newTeamName,
      seasonId: currentSeason.id,
      players: {
        starters: selectedStarters,
        substitutes: selectedSubstitutes,
      },
    });
    setNewTeamName("");
    setSelectedStarters([]);
    setSelectedSubstitutes([]);
    fetchTeams();
  };

  const handleDeleteTeam = async (id: string) => {
    await deleteDoc(doc(db, "teams", id));
    fetchTeams();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des équipes</h1>
      <form onSubmit={handleAddTeam} className="mb-4 space-y-4">
        <div>
          <Label htmlFor="teamName">Nom de l'équipe</Label>
          <Input
            id="teamName"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            required
          />
        </div>
        <div>{/* Removed Season Select */}</div>
        <div>
          <Label>Joueurs titulaires</Label>
          {players.map((player) => (
            <div key={player.id}>
              <input
                type="checkbox"
                id={`starter-${player.id}`}
                checked={selectedStarters.includes(player.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStarters([...selectedStarters, player.id]);
                  } else {
                    setSelectedStarters(
                      selectedStarters.filter((id) => id !== player.id)
                    );
                  }
                }}
              />
              <label htmlFor={`starter-${player.id}`}>{player.name}</label>
            </div>
          ))}
        </div>
        <div>
          <Label>Joueurs remplaçants</Label>
          {players.map((player) => (
            <div key={player.id}>
              <input
                type="checkbox"
                id={`substitute-${player.id}`}
                checked={selectedSubstitutes.includes(player.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSubstitutes([...selectedSubstitutes, player.id]);
                  } else {
                    setSelectedSubstitutes(
                      selectedSubstitutes.filter((id) => id !== player.id)
                    );
                  }
                }}
              />
              <label htmlFor={`substitute-${player.id}`}>{player.name}</label>
            </div>
          ))}
        </div>
        <Button type="submit">Ajouter une équipe</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Saison</TableHead>
            <TableHead>Joueurs titulaires</TableHead>
            <TableHead>Joueurs remplaçants</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{currentSeason?.name}</TableCell>
              <TableCell>{team.players.starters.length}</TableCell>
              <TableCell>{team.players.substitutes.length}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamManagement;
