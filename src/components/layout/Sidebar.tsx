
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Leaf, 
  Home, 
  BarChart,
  Calculator, 
  FileText, 
  Lightbulb, 
  Award, 
  User, 
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-medium",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Home" },
    { to: "/calculator", icon: <Calculator className="h-5 w-5" />, label: "Carbon Calculator" },
    { to: "/dashboard/progress", icon: <BarChart className="h-5 w-5" />, label: "Dashboard" },
    { to: "/reports", icon: <FileText className="h-5 w-5" />, label: "Reports" },
    { to: "/suggestions", icon: <Lightbulb className="h-5 w-5" />, label: "Suggestions" },
    { to: "/badges", icon: <Award className="h-5 w-5" />, label: "Green Points" },
    { to: "/profile", icon: <User className="h-5 w-5" />, label: "Profile" }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <Leaf className="h-6 w-6 text-sidebar-primary-foreground" />
          <h2 className="text-lg font-semibold text-sidebar-primary-foreground">Ecofootprint</h2>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="bg-sidebar-accent rounded-md p-4">
          <h3 className="font-medium text-sm text-sidebar-accent-foreground">Daily Eco Tip</h3>
          <p className="text-xs mt-1 text-sidebar-accent-foreground opacity-80">
            Turn off electronics when not in use to save energy.
          </p>
          <NavLink to="/tips">
            <Button variant="link" size="sm" className="mt-2 px-0 text-xs text-sidebar-primary">
              See more tips
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 h-screen bg-sidebar shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-3 left-3 z-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
