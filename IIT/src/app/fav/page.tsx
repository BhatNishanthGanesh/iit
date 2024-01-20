import FavCards from "@/components/fav-cards";
import React from "react";

const Fav = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0 bg-black w-100 h-20 shadow-lg" />
      <FavCards />
    </div>
  );
};

export default Fav;
