import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Shield,
  Calendar,
  CurrencyIcon as Exchange,
  BarChartIcon as ChartBar,
  Settings,
  LogOut,
} from "lucide-react";
import { auth } from "../config/firebase";
import { toast } from "../components/ui/use-toast";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  roles?: string[];
  userRole: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, roles, userRole }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (roles && !roles.includes(userRole)) {
    return null;
  }

  return (
    <Link
      to={to}
      className={`flex items-center text-white py-2 px-4 rounded hover:bg-gray-700 ${
        isActive ? "bg-gray-700" : ""
      }`}
    >
      {children}
    </Link>
  );
};

interface NavigationProps {
  userRole: string;
}

const Navigation: React.FC<NavigationProps> = ({ userRole }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-gray-800 w-64 min-h-screen px-4 py-6">
      <ul className="space-y-2">
        <NavLink to="/" userRole={userRole}>
          <Home className="mr-3" size={20} />
          Tableau de bord
        </NavLink>
        <NavLink to="/players" userRole={userRole} roles={["admin", "coach"]}>
          <Users className="mr-3" size={20} />
          Joueurs
        </NavLink>
        <NavLink to="/teams" userRole={userRole} roles={["admin", "coach"]}>
          <Shield className="mr-3" size={20} />
          Équipes
        </NavLink>
        <NavLink to="/matches" userRole={userRole}>
          <Calendar className="mr-3" size={20} />
          Matchs
        </NavLink>
        <NavLink to="/transfers" userRole={userRole} roles={["admin"]}>
          <Exchange className="mr-3" size={20} />
          Transferts
        </NavLink>
        <NavLink to="/performance" userRole={userRole} roles={["admin", "coach"]}>
          <ChartBar className="mr-3" size={20} />
          Performances
        </NavLink>
        <NavLink to="/admin" userRole={userRole} roles={["admin"]}>
          <Settings className="mr-3" size={20} />
          Administration
        </NavLink>
      </ul>
      <button
        onClick={handleLogout}
        className="flex items-center text-white py-2 px-4 rounded hover:bg-gray-700 mt-4"
      >
        <LogOut className="mr-3" size={20} />
        Déconnexion
      </button>
    </nav>
  );
};

export default Navigation;
