import React from "react";
import { useRouter } from "next/router";
import App from "../../App";
import PlayerProfile from "../../components/PlayerProfile";

const PlayerProfilePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <App>
      <PlayerProfile playerId={id as string} />
    </App>
  );
};

export default PlayerProfilePage;
