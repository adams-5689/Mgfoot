import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
  href: string;
  children: React.ReactNode;
  roles?: string[];
  userRole: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  roles,
  userRole,
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  if (roles && !roles.includes(userRole)) {
    return null;
  }

  return (
    <Link href={href}>
      <a
        className={`flex items-center text-white py-2 px-4 rounded hover:bg-gray-700 ${
          isActive ? "bg-gray-700" : ""
        }`}
      >
        {children}
      </a>
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
        <NavLink href="/" userRole={userRole}>
          <Home className="mr-3" size={20} />
          Tableau de bord
        </NavLink>
        <NavLink href="/players" userRole={userRole} roles={["admin", "coach"]}>
          <Users className="mr-3" size={20} />
          Joueurs
        </NavLink>
        <NavLink href="/teams" userRole={userRole} roles={["admin", "coach"]}>
          <Shield className="mr-3" size={20} />
          Équipes
        </NavLink>
        <NavLink href="/matches" userRole={userRole}>
          <Calendar className="mr-3" size={20} />
          Matchs
        </NavLink>
        <NavLink href="/transfers" userRole={userRole} roles={["admin"]}>
          <Exchange className="mr-3" size={20} />
          Transferts
        </NavLink>
        <NavLink
          href="/performance"
          userRole={userRole}
          roles={["admin", "coach"]}
        >
          <ChartBar className="mr-3" size={20} />
          Performances
        </NavLink>
        <NavLink href="/admin" userRole={userRole} roles={["admin"]}>
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
