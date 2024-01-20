import React, { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner"

export default function ProductCard({ product }: any) {
  const [fav, setFav] = useState(false);

  const addProductToFavorites = async () => {
    try {
      const response = await fetch("http://localhost:3100/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.title,
          prices: [10, 20, 30],
          img: product.image,
        }),
      });

      if (!response.ok) {
        console.error("Failed to add product to favorites");
        return;
      }

      const data = await response.json();
      console.log("Product added successfully:", data);
      toast("Product added successfully.")
      setFav(true); // Set fav to true after successfully adding to favorites
    } catch (error) {
      console.error("Error adding product to favorites:", error);
    }
  };
  const removeProductFromFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:3100/products/${product.title}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        console.error("Failed to remove product from favorites");
        return;
      }
  
      // Check if the response is empty
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        // If content-type is JSON, parse the response
        const data = await response.json();
        console.log("Product removed successfully:", data);
        toast("Deleted.")
      } else {
        // If content-type is not JSON (empty response), log a message
        console.log("Product removed successfully.");
        toast("Deleted.")
      }
  
      setFav(false); // Set fav to false after successfully removing from favorites
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      toast("Error.")
    }
  };
  

  const handleHeartClick = () => {
    if (fav) {
      // If already a favorite, remove from favorites
      removeProductFromFavorites();
    } else {
      // If not a favorite, add to favorites
      addProductToFavorites();
    }
  };


  return (
    <>
      <div className="border group pb-4 rounded-md relative">
        <div className="absolute top-2 right-2 z-10">
          {fav ? (
            <FaHeart
              size={24}
              color="#ff0066"
              onClick={handleHeartClick}
            />
          ) : (
            <Heart
              size={24}
              color="#ff0066"
              onClick={handleHeartClick}
            />
          )}
        </div>
        <div className="relative overflow-hidden rounded-t-md aspect-square">
          <Image src={product.image || product.img} alt="" width={500} height={500} className="" />
        </div>
        <div className="px-2">
          <div className="flex justify-between">
            <div>
              <h3 className="mt-2 text-lg font-semibold text-gray-500">
                {product?.title || product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-400">₹ {product?.price}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
