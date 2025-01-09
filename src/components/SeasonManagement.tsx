import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const SeasonManagement: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [newSeasonStartDate, setNewSeasonStartDate] = useState("");
  const [newSeasonEndDate, setNewSeasonEndDate] = useState("");

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    const querySnapshot = await getDocs(collection(db, "seasons"));
    const fetchedSeasons: Season[] = [];
    querySnapshot.forEach((doc) => {
      fetchedSeasons.push({ id: doc.id, ...doc.data() } as Season);
    });
    setSeasons(fetchedSeasons);
  };

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "seasons"), {
      name: newSeasonName,
      startDate: newSeasonStartDate,
      endDate: newSeasonEndDate,
    });
    setNewSeasonName("");
    setNewSeasonStartDate("");
    setNewSeasonEndDate("");
    fetchSeasons();
  };

  const handleDeleteSeason = async (id: string) => {
    await deleteDoc(doc(db, "seasons", id));
    fetchSeasons();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des saisons</h1>
      <form onSubmit={handleAddSeason} className="mb-4 space-y-4">
        <div>
          <Label htmlFor="seasonName">Nom de la saison</Label>
          <Input
            id="seasonName"
            value={newSeasonName}
            onChange={(e) => setNewSeasonName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="seasonStartDate">Date de début</Label>
          <Input
            id="seasonStartDate"
            type="date"
            value={newSeasonStartDate}
            onChange={(e) => setNewSeasonStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="seasonEndDate">Date de fin</Label>
          <Input
            id="seasonEndDate"
            type="date"
            value={newSeasonEndDate}
            onChange={(e) => setNewSeasonEndDate(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Ajouter une saison</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Date de fin</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seasons.map((season) => (
            <TableRow key={season.id}>
              <TableCell>{season.name}</TableCell>
              <TableCell>{season.startDate}</TableCell>
              <TableCell>{season.endDate}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteSeason(season.id)}
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

export default SeasonManagement;
