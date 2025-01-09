import {
  collection,
  doc,
  setDoc,
  addDoc,
  Timestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";

// Le reste du code reste inchangé
