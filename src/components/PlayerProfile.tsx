import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  weight: number;
  height: number;
  photo: string;
}

interface Match {
  id: string;
  date: string;
  opponent: string;
  result: string;
}

interface Injury {
  id: string;
  date: string;
  description: string;
  status: "active" | "recovered";
}

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
}

const PlayerProfile: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (playerId) {
        const playerDoc = await getDoc(doc(db, "players", playerId));
        if (playerDoc.exists()) {
          setPlayer({ id: playerDoc.id, ...playerDoc.data() } as Player);
        }

        // Fetch matches
        const matchesQuery = query(
          collection(db, "matches"),
          where("players", "array-contains", playerId)
        );
        const matchesSnapshot = await getDocs(matchesQuery);
        const matchesData: Match[] = [];
        matchesSnapshot.forEach((doc) => {
          matchesData.push({ id: doc.id, ...doc.data() } as Match);
        });
        setMatches(matchesData);

        // Fetch injuries
        const injuriesQuery = query(
          collection(db, "injuries"),
          where("playerId", "==", playerId)
        );
        const injuriesSnapshot = await getDocs(injuriesQuery);
        const injuriesData: Injury[] = [];
        injuriesSnapshot.forEach((doc) => {
          injuriesData.push({ id: doc.id, ...doc.data() } as Injury);
        });
        setInjuries(injuriesData);

        // Fetch documents
        const documentsQuery = query(
          collection(db, "documents"),
          where("playerId", "==", playerId)
        );
        const documentsSnapshot = await getDocs(documentsQuery);
        const documentsData: Document[] = [];
        documentsSnapshot.forEach((doc) => {
          documentsData.push({ id: doc.id, ...doc.data() } as Document);
        });
        setDocuments(documentsData);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  if (!player) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {player.firstName} {player.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <img
              src={player.photo}
              alt={`${player.firstName} ${player.lastName}`}
              className="w-32 h-32 rounded-full"
            />
            <div>
              <p>
                Date de naissance:{" "}
                {new Date(player.dateOfBirth).toLocaleDateString()}
              </p>
              <p>Taille: {player.height} cm</p>
              <p>Poids: {player.weight} kg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="matches" className="mt-6">
        <TabsList>
          <TabsTrigger value="matches">Matchs</TabsTrigger>
          <TabsTrigger value="injuries">Blessures</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>Historique des matchs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {matches.map((match) => (
                  <li key={match.id} className="mb-2">
                    {new Date(match.date).toLocaleDateString()} -{" "}
                    {match.opponent} - {match.result}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="injuries">
          <Card>
            <CardHeader>
              <CardTitle>Historique des blessures</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {injuries.map((injury) => (
                  <li key={injury.id} className="mb-2">
                    {new Date(injury.date).toLocaleDateString()} -{" "}
                    {injury.description} - Statut: {injury.status}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {documents.map((document) => (
                  <li key={document.id} className="mb-2">
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {document.fileName}
                    </a>
                    - Ajouté le{" "}
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayerProfile;
