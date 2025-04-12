
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
