import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Calendar,
  CurrencyIcon as Exchange,
  BarChart2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface DashboardProps {
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const cards = [
    {
      title: "Gestion des joueurs",
      description: "Gérer les profils et les performances des joueurs",
      icon: Users,
      to: "/players",
      roles: ["admin", "coach"],
    },
    {
      title: "Gestion des équipes",
      description: "Gérer la composition et les statistiques des équipes",
      icon: Shield,
      to: "/teams",
      roles: ["admin", "coach"],
    },
    {
      title: "Gestion des matchs",
      description: "Planifier et suivre les matchs",
      icon: Calendar,
      to: "/matches",
      roles: ["admin", "coach", "player"],
    },
    {
      title: "Transferts",
      description: "Gérer les transferts de joueurs",
      icon: Exchange,
      to: "/transfers",
      roles: ["admin"],
    },
    {
      title: "Performances",
      description: "Analyser les performances des joueurs et des équipes",
      icon: BarChart2,
      to: "/performance",
      roles: ["admin", "coach"],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        if (card.roles && !card.roles.includes(userRole)) {
          return null;
        }

        return (
          <Link key={card.to} to={card.to}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default Dashboard;
