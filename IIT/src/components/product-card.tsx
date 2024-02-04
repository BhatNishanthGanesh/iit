'use client'
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export default function ProductCard({ product, price }: any) {
  const [fav, setFav] = useState(false);
  const router=useRouter()
  const cleanUpPrice = (price: string) => {
    return price.replace(/[^\d.]/g, "").trim();
  };
  const pathname=usePathname()

  const addProductToFavorites = async () => {
    try {
      const cleanedPrice = cleanUpPrice(product.price);
      const priceValue = parseFloat(cleanedPrice);
      const isPriceValid = !isNaN(priceValue) && isFinite(priceValue);

      if (!isPriceValid) {
        console.error("Invalid price value:", product.price);
        return;
      }

      const requestData = {
        name: product.title,
        currentPrice: priceValue,
        img: product.image,
        platform: product.site,
      };

      console.log("Adding product to favorites:", requestData);

      const response = await fetch("http://localhost:3100/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error(
          "Failed to add product to favorites. Server response:",
          response
        );
        return;
      }

      const data = await response.json();
      console.log("Product added successfully:", data);
      toast("Product added successfully.");
      setFav(true); // Set fav to true after successfully adding to favorites
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      toast("Error adding product to favorites.");
    }
  };

  const removeProductFromFavorites = async () => {
    try {
      const encodedProductName = encodeURIComponent(product.title);
      const response = await fetch(
        `http://localhost:3100/products/${encodedProductName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to remove product from favorites. Server response:",
          response
        );
        return;
      }

      // Check if the response is empty
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        // If content-type is JSON, parse the response
        const data = await response.json();
        console.log("Product removed successfully:", data);
        toast("Deleted.");
      } else {
        // If content-type is not JSON (empty response), log a message
        console.log("Product removed successfully.");
        toast("Deleted.");
      }

      setFav(false); // Set fav to false after successfully removing from favorites
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      toast("Error.");
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

  useEffect(() => {
    // Fetch the initial liked state from the server/database
    // For demonstration purposes, I'm assuming you have an endpoint to fetch this information
    const fetchLikedState = async () => {
      try {
        const response = await fetch(`http://localhost:3100/products/${encodeURIComponent(product.title)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch liked state");
        }

        const data = await response.json();
        // Update the liked state based on the response from the server
        setFav(data.isLiked);
      } catch (error) {
        console.error("Error fetching liked state:", error);
      }
    };

    fetchLikedState();
  }, [product.title]);

  useEffect(() => {
    // Check if the router pathname is "/fav" and set fav to true
    if (router.pathname === "/fav") {
      setFav(true);
    }
  }, [router.pathname]);

  const renderTitle = () => {
    // Check if the product title from the database matches the title from scraping
    if (product?.title && product.title === product.name) {
      return <h3 className="mt-2 text-lg font-semibold text-gray-500">Hello, {product.title}</h3>;
    }
    return <h3 className="mt-2 text-lg font-semibold text-gray-500">{product?.title || product.name}</h3>;
  };

  return (
    <>
      <div className="border group pb-4 rounded-md relative">
        <div className="absolute top-2 right-2 z-10">
            {/* {product.title} */}
          {fav  || pathname=='/fav' ? (
            <FaHeart size={24} color="#ff0066" onClick={handleHeartClick} />
          ) : (
            <Heart size={24} color="#ff0066" onClick={handleHeartClick} />
          )}
        </div>
        <div className="relative overflow-hidden rounded-t-md aspect-square">
          <Image
            src={product.image || product.img}
            alt=""
            width={500}
            height={500}
            className=""
          />
        </div>
        <div className="px-2">
          <div className="flex justify-between">
            <div>{renderTitle()}</div>
            <p className="mt-1 text-sm text-gray-400">₹ {product?.price}</p>
          </div>
        </div>
      </div>
    </>
  );
}
