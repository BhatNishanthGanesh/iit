'use client'
import React,{useState,useEffect} from "react";
import ProductCard from "./product-card";

const FavCards = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
      const fetchFavorites = async () => {
        try {
          const response = await fetch("http://localhost:3100/fav"); 
          if (!response.ok) {
            throw new Error("Failed to fetch favorites");
          }
  
          const data = await response.json();
          console.log(data)
          setFavorites(data);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };
  
      fetchFavorites();
    }, []);

  return (
    <div className="
        grid grid-cols-1 md:grid-cols-5 gap-4 mt-8
    ">
      {favorites.map((card,i) => (
        <ProductCard product={card} key={i}/>
      ))}
    </div>
  );
};

export default FavCards;
