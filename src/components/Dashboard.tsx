import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Users,
  Shield,
  Calendar,
  CurrencyIcon as Exchange,
  BarChartIcon as ChartBar,
} from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/players">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gestion des joueurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Gérer les profils et les performances des joueurs
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link to="/teams">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gestion des équipes
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Gérer la composition et les statistiques des équipes
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link to="/matches">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gestion des matchs
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Planifier et suivre les matchs
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link to="/transfers">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferts</CardTitle>
            <Exchange className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Gérer les transferts de joueurs
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link to="/performance">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performances</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Analyser les performances des joueurs et des équipes
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default Dashboard;
