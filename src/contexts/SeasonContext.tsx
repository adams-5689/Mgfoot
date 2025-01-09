import React, { createContext, useState, useContext, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface SeasonContextType {
  currentSeason: Season | null;
  setCurrentSeason: (season: Season) => void;
  allSeasons: Season[];
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [allSeasons, setAllSeasons] = useState<Season[]>([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      const querySnapshot = await getDocs(collection(db, "seasons"));
      const seasons: Season[] = [];
      querySnapshot.forEach((doc) => {
        seasons.push({ id: doc.id, ...doc.data() } as Season);
      });
      setAllSeasons(seasons);
      if (seasons.length > 0 && !currentSeason) {
        setCurrentSeason(seasons[0]);
      }
    };
    fetchSeasons();
  }, []);

  return (
    <SeasonContext.Provider
      value={{ currentSeason, setCurrentSeason, allSeasons }}
    >
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
};
