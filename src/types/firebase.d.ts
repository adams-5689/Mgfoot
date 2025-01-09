import { FirebaseApp as FirebaseAppType } from "firebase/app";

declare global {
  interface Window {
    firebase: {
      app: FirebaseAppType;
    };
  }
}

declare module "firebase/app" {
  export interface FirebaseApp extends FirebaseAppType {}
}

declare module "firebase/firestore" {
  export * from "firebase/firestore";
}

declare module "firebase/auth" {
  export * from "firebase/auth";
}

declare module "firebase/storage" {
  export * from "firebase/storage";
}
