"use client";

import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface AuthProps {
  setUserRole: (role: string) => void;
}

const Auth: React.FC<AuthProps> = ({ setUserRole }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>{isLogin ? "Connexion" : "Inscription"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Connectez-vous à votre compte"
            : "Créez un nouveau compte"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLogin ? (
          <Login setUserRole={setUserRole} />
        ) : (
          <SignUp setUserRole={setUserRole} />
        )}
        <Button
          onClick={() => setIsLogin(!isLogin)}
          variant="link"
          className="mt-4 w-full"
        >
          {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Auth;
