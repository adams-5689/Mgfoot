import React, { useState } from "react";
import {
  initializeFirestore,
  addSampleData,
} from "../utils/initializeFirestore";
import { Button } from "../components/ui/button";

const DatabaseInitializer: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isAddingSampleData, setIsAddingSampleData] = useState(false);
  const [message, setMessage] = useState("");

  const handleInitialize = async () => {
    setIsInitializing(true);
    setMessage("");
    try {
      await initializeFirestore();
      setMessage("Base de données initialisée avec succès !");
    } catch (error) {
      setMessage("Erreur lors de l'initialisation de la base de données.");
      console.error(error);
    }
    setIsInitializing(false);
  };

  const handleAddSampleData = async () => {
    setIsAddingSampleData(true);
    setMessage("");
    try {
      await addSampleData();
      setMessage("Données d'exemple ajoutées avec succès !");
    } catch (error) {
      setMessage("Erreur lors de l'ajout des données d'exemple.");
      console.error(error);
    }
    setIsAddingSampleData(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleInitialize} disabled={isInitializing}>
        {isInitializing
          ? "Initialisation..."
          : "Initialiser la base de données"}
      </Button>
      <Button onClick={handleAddSampleData} disabled={isAddingSampleData}>
        {isAddingSampleData
          ? "Ajout des données..."
          : "Ajouter des données d'exemple"}
      </Button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default DatabaseInitializer;
