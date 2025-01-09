import { db } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export const initializeFirestore = async () => {
  try {
    // Initialize collections
    const collections = [
      "users",
      "players",
      "teams",
      "matches",
      "training",
      "performances",
      "contracts",
      "documents",
      "divisions",
      "budget",
      "socialMediaPosts",
      "systemSettings",
    ];

    for (const collectionName of collections) {
      await setDoc(doc(collection(db, collectionName), "init"), {
        initialized: true,
        timestamp: new Date(),
      });
      console.log(`Collection ${collectionName} initialized`);
    }

    // Initialize system settings
    await setDoc(doc(db, "systemSettings", "general"), {
      clubName: "FC Example",
      maxPlayersPerTeam: 25,
      seasonStartDate: new Date(new Date().getFullYear(), 7, 1), // August 1st of current year
      seasonEndDate: new Date(new Date().getFullYear() + 1, 5, 30), // June 30th of next year
      logoUrl: "",
      primaryColor: "#FF0000",
      secondaryColor: "#0000FF",
      updatedAt: new Date(),
    });

    console.log(
      "Firestore collections and system settings initialized successfully"
    );
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};
