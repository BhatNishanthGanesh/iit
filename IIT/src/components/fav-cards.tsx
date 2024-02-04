
'use client'
import React, { useState, useEffect } from "react";
import ProductCard from "./product-card";
import { usePathname } from 'next/navigation'
const FavCards = () => {
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default to ascending
  const nthIndex = 2; // Change this to the desired index (0-based) you want to consider
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:3100/fav");
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        console.log(data);
        
        setFavorites(data);
        setPrice(data.price[0]);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Function to handle sorting based on the nth index of prices
  const handleSort = (order:any) => {
    setSortOrder(order);
    const sortedFavorites = [...favorites];
    sortedFavorites.sort((a, b) => {
      const priceA =
        a.prices && a.prices.length > nthIndex ? a.prices[nthIndex] : 0;
      const priceB =
        b.prices && b.prices.length > nthIndex ? b.prices[nthIndex] : 0;

      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
    setFavorites(sortedFavorites);
  };



  return (
    <div className="container mx-auto mt-16 p-4">
      <div className="flex  items-center mb-4">
        <label className="mr-2 mt-2 font-bold text-lg">Sort by Price:</label>
        <select
          onChange={(e) => handleSort(e.target.value)}
          value={sortOrder}
          className="p-2 border mt-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map((card, i) => (
          <ProductCard product={card} price={10} key={i} />
        ))}
      </div>
    </div>
  );
};

export default FavCards;
