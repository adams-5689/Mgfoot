import React from "react";
import { useRouter } from "next/router";
import App from "../App";
import AdminPanel from "../components/AdminPanel";

const AdminPage: React.FC<{ userRole: string }> = ({ userRole }) => {
  const router = useRouter();

  if (userRole !== "admin") {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    return null;
  }

  return (
    <App>
      <AdminPanel />
    </App>
  );
};

export default AdminPage;
