
import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { currentUser, loading } = useAuth();
  
  // If authentication is required and user is not logged in, redirect to home
  if (requireAuth && !loading && !currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen bg-background">
      {currentUser && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t">
          <p>© {new Date().getFullYear()} Ecofootprint - Track your carbon footprint</p>
        </footer>
      </div>
    </div>
  );
};
