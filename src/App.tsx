import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";
import { SeasonProvider } from "./contexts/SeasonContext";
import Navigation from "./components/Navigation";
import SeasonSelector from "./components/SeasonSelector";
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./components/ui/toast";

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return null; // La redirection vers /login est gérée dans l'useEffect
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
                <Outlet />
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </SeasonProvider>
    </ToastProvider>
  );
};

export default App;
