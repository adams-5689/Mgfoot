import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

interface Match {
  id: string;
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamPlayers: {
    starters: string[];
    substitutes: string[];
  };
  awayTeamPlayers: {
    starters: string[];
    substitutes: string[];
  };
  seasonId: string;
}

interface Team {
  id: string;
  name: string;
  seasonId: string;
  players: {
    starters: string[];
    substitutes: string[];
  };
}

interface Season {
  id: string;
  name: string;
}

const MatchManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [newMatchDate, setNewMatchDate] = useState('');
  const [selectedHomeTeam, setSelectedHomeTeam] = useState('');
  const [selectedAwayTeam, setSelectedAwayTeam] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [homeTeamStarters, setHomeTeamStarters] = useState<string[]>([]);
  const [homeTeamSubstitutes, setHomeTeamSubstitutes] = useState<string[]>([]);
  const [awayTeamStarters, setAwayTeamStarters] = useState<string[]>([]);
  const [awayTeamSubstitutes, setAwayTeamSubstitutes] = useState<string[]>([]);

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchSeasons();
  }, []);

  const fetchMatches = async () => {
    const querySnapshot = await getDocs(collection(db, 'matches'));
    const fetchedMatches: Match[] = [];
    querySnapshot.forEach((doc) => {
      fetchedMatches.push({ id: doc.id, ...doc.data() } as Match);
    });
    setMatches(fetchedMatches);
  };

  const fetchTeams = async () => {
    constfetchTeams = async () => {
    const querySnapshot = await getDocs(collection(db, 'teams'));
    const fetchedTeams: Team[] = [];
    querySnapshot.forEach((doc) => {
      fetchedTeams.push({ id: doc.id, ...doc.data() } as Team);
    });
    setTeams(fetchedTeams);
  };

  const fetchSeasons = async () => {
    const querySnapshot = await getDocs(collection(db, 'seasons'));
    const fetchedSeasons: Season[] = [];
    querySnapshot.forEach((doc) => {
      fetchedSeasons.push({ id: doc.id, ...doc.data() } as Season);
    });
    setSeasons(fetchedSeasons);
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'matches'), {
      date: newMatchDate,
      homeTeamId: selectedHomeTeam,
      awayTeamId: selectedAwayTeam,
      homeTeamPlayers: {
        starters: homeTeamStarters,
        substitutes: homeTeamSubstitutes,
      },
      awayTeamPlayers: {
        starters: awayTeamStarters,
        substitutes: awayTeamSubstitutes,
      },
      seasonId: selectedSeason,
    });
    setNewMatchDate('');
    setSelectedHomeTeam('');
    setSelectedAwayTeam('');
    setSelectedSeason('');
    setHomeTeamStarters([]);
    setHomeTeamSubstitutes([]);
    setAwayTeamStarters([]);
    setAwayTeamSubstitutes([]);
    fetchMatches();
  };

  const handleDeleteMatch = async (id: string) => {
    await deleteDoc(doc(db, 'matches', id));
    fetchMatches();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des matchs</h1>
      <form onSubmit={handleAddMatch} className="mb-4 space-y-4">
        <div>
          <Label htmlFor="matchDate">Date du match</Label>
          <Input
            id="matchDate"
            type="date"
            value={newMatchDate}
            onChange={(e) => setNewMatchDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="seasonSelect">Saison</Label>
          <Select
            id="seasonSelect"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            required
          >
            <option value="">Sélectionner une saison</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>{season.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="homeTeamSelect">Équipe à domicile</Label>
          <Select
            id="homeTeamSelect"
            value={selectedHomeTeam}
            onChange={(e) => {
              setSelectedHomeTeam(e.target.value);
              const team = teams.find(t => t.id === e.target.value);
              if (team) {
                setHomeTeamStarters(team.players.starters);
                setHomeTeamSubstitutes(team.players.substitutes);
              }
            }}
            required
          >
            <option value="">Sélectionner une équipe</option>
            {teams.filter(team => team.seasonId === selectedSeason).map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="awayTeamSelect">Équipe à l'extérieur</Label>
          <Select
            id="awayTeamSelect"
            value={selectedAwayTeam}
            onChange={(e) => {
              setSelectedAwayTeam(e.target.value);
              const team = teams.find(t => t.id === e.target.value);
              if (team) {
                setAwayTeamStarters(team.players.starters);
                setAwayTeamSubstitutes(team.players.substitutes);
              }
            }}
            required
          >
            <option value="">Sélectionner une équipe</option>
            {teams.filter(team => team.seasonId === selectedSeason && team.id !== selectedHomeTeam).map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </Select>
        </div>
        <Button type="submit">Ajouter un match</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Saison</TableHead>
            <TableHead>Équipe à domicile</TableHead>
            <TableHead>Équipe à l'extérieur</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
              <TableCell>{seasons.find(s => s.id === match.seasonId)?.name}</TableCell>
              <TableCell>{teams.find(t => t.id === match.homeTeamId)?.name}</TableCell>
              <TableCell>{teams.find(t => t.id === match.awayTeamId)?.name}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteMatch(match.id)}>Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchManagement;

