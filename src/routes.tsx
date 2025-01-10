import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/Dashboard";
import PlayerManagement from "./components/PlayerManagement";
import TeamManagement from "./components/TeamManagement";
import MatchManagement from "./components/MatchManagement";
import PlayerTransfer from "./components/PlayerTransfer";
import PerformanceTracking from "./components/PerformanceTracking";
import AdminPanel from "./components/AdminPanel";
import Auth from "./components/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard userRole="admin" />, // Le rôle sera passé dynamiquement
      },
      {
        path: "players",
        element: <PlayerManagement />,
      },
      {
        path: "teams",
        element: <TeamManagement />,
      },
      {
        path: "matches",
        element: <MatchManagement />,
      },
      {
        path: "transfers",
        element: <PlayerTransfer />,
      },
      {
        path: "performance",
        element: <PerformanceTracking />,
      },
      {
        path: "admin",
        element: <AdminPanel />,
      },
    ],
  },
  {
    path: "/login",
    element: <Auth setUserRole={() => {}} />, // La fonction sera passée dynamiquement
  },
]);
