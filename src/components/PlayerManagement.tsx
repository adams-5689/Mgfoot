import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Link from "next/link";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useSeason } from "../contexts/SeasonContext";
import { toast } from "../components/ui/use-toast";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  seasonId: string; // Added seasonId
}

const PLAYERS_PER_PAGE = 10;

const PlayerManagement: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentSeason } = useSeason();

  useEffect(() => {
    if (currentSeason) {
      fetchPlayers();
    }
  }, [currentSeason]);

  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "players"),
        where("seasonId", "==", currentSeason?.id),
        orderBy("lastName"),
        limit(PLAYERS_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);
      const fetchedPlayers: Player[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPlayers.push({ id: doc.id, ...doc.data() } as Player);
      });
      setPlayers(fetchedPlayers);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Une erreur est survenue lors du chargement des joueurs.");
      toast({
        title: "Erreur",
        description: "Impossible de charger les joueurs. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePlayers = async () => {
    if (!lastVisible || loading) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "players"),
        where("seasonId", "==", currentSeason?.id),
        orderBy("lastName"),
        startAfter(lastVisible),
        limit(PLAYERS_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);
      const fetchedPlayers: Player[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPlayers.push({ id: doc.id, ...doc.data() } as Player);
      });
      setPlayers([...players, ...fetchedPlayers]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching more players:", err);
      setError(
        "Une erreur est survenue lors du chargement de plus de joueurs."
      );
      toast({
        title: "Erreur",
        description:
          "Impossible de charger plus de joueurs. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des joueurs</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
      {/* Display error message */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Date de naissance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.lastName}</TableCell>
              <TableCell>{player.firstName}</TableCell>
              <TableCell>
                {new Date(player.dateOfBirth).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`/player/${player.id}`}>
                  <Button variant="outline">Voir le profil</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {lastVisible && (
        <div className="mt-4 text-center">
          <Button onClick={fetchMorePlayers} disabled={loading}>
            {loading ? "Chargement..." : "Charger plus"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;
