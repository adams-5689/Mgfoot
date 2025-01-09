import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import App from "../App";
import Dashboard from "../components/Dashboard";
import Auth from "../components/Auth";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Auth setUserRole={setUserRole} />;
  }

  return (
    <App>
      <Dashboard userRole={userRole} />
    </App>
  );
};

export default HomePage;
