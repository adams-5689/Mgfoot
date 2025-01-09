declare module "firebase/app" {
  import firebase from "firebase/app";
  export default firebase;
}

declare module "firebase/firestore" {
  import { firestore } from "firebase/app";
  export { firestore };
}

declare module "firebase/auth" {
  import { auth } from "firebase/app";
  export { auth };
}

declare module "firebase/storage" {
  import { storage } from "firebase/app";
  export { storage };
}
