import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { SeasonProvider } from "./contexts/SeasonContext";
import Navigation from "./components/Navigation";
import SeasonSelector from "./components/SeasonSelector";
import Auth from "./components/Auth";
// import { Toaster } from "/components/ui/toast";
import { ToastProvider } from "./components/ui/toast";

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return (
      <ToastProvider>
        <Auth setUserRole={setUserRole} />
        {/* <Toaster /> */}
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <SeasonProvider>
        <div className="flex h-screen bg-gray-100">
          <Navigation userRole={userRole} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion du Club de Football
                </h1>
                <SeasonSelector />
              </div>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
              <div className="container mx-auto px-6 py-8">
                {React.Children.map(children, (child) =>
                  React.isValidElement(child)
                    ? React.cloneElement(child, { userRole })
                    : child
                )}
              </div>
            </main>
          </div>
        </div>
        {/* <Toaster /> */}
      </SeasonProvider>
    </ToastProvider>
  );
};

export default App;
