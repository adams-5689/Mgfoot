import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Shield,
  Calendar,
  CurrencyIcon as Exchange,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { auth } from "../config/firebase";
import { toast } from "../components/ui/use-toast";

interface NavLinkProps {
  to: string;
  roles?: string[];
  userRole: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children, roles, userRole }: NavLinkProps) => {
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
      <div className="space-y-2">
        <NavLink to="/" userRole={userRole}>
          <Home className="h-4 w-4 mr-2" />
          Tableau de bord
        </NavLink>
        <NavLink to="/players" userRole={userRole} roles={["admin", "coach"]}>
          <Users className="h-4 w-4 mr-2" />
          Joueurs
        </NavLink>
        <NavLink to="/teams" userRole={userRole} roles={["admin", "coach"]}>
          <Shield className="h-4 w-4 mr-2" />
          Équipes
        </NavLink>
        <NavLink to="/matches" userRole={userRole}>
          <Calendar className="h-4 w-4 mr-2" />
          Matchs
        </NavLink>
        <NavLink to="/transfers" userRole={userRole} roles={["admin"]}>
          <Exchange className="h-4 w-4 mr-2" />
          Transferts
        </NavLink>
        <NavLink
          to="/performance"
          userRole={userRole}
          roles={["admin", "coach"]}
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Performances
        </NavLink>
        <NavLink to="/admin" userRole={userRole} roles={["admin"]}>
          <Settings className="h-4 w-4 mr-2" />
          Administration
        </NavLink>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center text-white py-2 px-4 rounded hover:bg-gray-700 mt-4 w-full"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Déconnexion
      </button>
    </nav>
  );
};

export default Navigation;
