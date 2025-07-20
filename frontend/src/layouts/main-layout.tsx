import Navbar from "@/components/layouts/navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className=" bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
