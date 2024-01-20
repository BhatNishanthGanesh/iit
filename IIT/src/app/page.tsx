"use client"
import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import ProductCard from "@/components/product-card";
import { motion } from "framer-motion";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import SquishyCard from "./components/trending";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Array<Product>>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [displayedProducts, setDisplayedProducts] = useState<number>(12); // Initial display limit
  const [loading, setLoading] = useState<boolean>(false);

  interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    platform:string
    imageUrl: string;
  }

  const handleSearch = async () => {
    try {
      // Fetch data from the API
      const response = await fetch("http://localhost:3100/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: searchTerm,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      // Parse the response into JSON
      const data: Product[] = await response.json();
      console.log(data)
      // Set the search results
      setSearchResults(data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading state to false when search is completed
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const handleLoadMore = () => {
    // Increase the displayedProducts count by 12 (or any desired value)
    setDisplayedProducts((prevCount) => prevCount + 12);
  };

  useEffect(() => {
    // Fetch data initially
    handleSearch();
  }, []);

  return (
    <>
      <div className="text-black h-screen flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 z-0 w-full h-24 bg-gradient-to-b from-neutral-0 to-white" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/Images/sloganBanner.png"
            alt="Slogan Banner"
            layout="fill"
            objectFit="contain"
          />
          <motion.div
            className="absolute bottom-10 transform translate-y-1/2 animate-bounce"
          >
            <span className="text-4xl cursor-pointer">
              <IoMdArrowDropdownCircle />
            </span>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-800/90 to-neutral-950/0" />
      <div ref={resultsRef} className="flex flex-col items-center justify-center] min-h-screen ">
        <h2 className="text-black  text-3xl m-3 mb-8 font-serif">
          Discover top-quality products for an enhanced shopping experience
        </h2>
        <Image
        src="/Images/mascot.png"
        alt="mascot"
        width={150}
        height={150}
        className="rounded-full shadow-lg transition-transform transform hover:shadow-none hover:scale-105 mb-10"
      />
        <div className="flex items-center border border-gray-900 bg-white rounded-full px-6 py-2 w-96">
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-grow w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="text-gray-500 p-1 rounded hover:text-gray-900 focus:outline-none"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
        </div>

        {/* {searchResults.flat().length > 0 ? (
          <div className="m-5">
            <h2 className="text-2xl font-bold mb-3">Search Results:</h2>
            <ul className="list-none grid md:grid-cols-6 gap-5 grid-cols-1">

               {searchResults
                .flat()
                .slice(0, displayedProducts) 
                .map((result, index) => (
                  <li key={index} className="flex shadow-lg items-center">
                    <ProductCard product={result} />
                  </li>
                ))}
            </ul>
            {searchResults.flat().length > displayedProducts && (
              <div className="flex justify-center mt-5">
              <button
                className="text-blue-500 p-2 rounded hover:text-blue-900 focus:outline-none shadow-md"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
            
            )}
          </div>
        ) : (
          <div className="m-5">
            <h2 className="text-2xl font-bold mb-3">No products found</h2>
          </div>

        )} */}

{loading ? (
          <div className="flex items-center justify-center m-5">
            {/* Loading animation can be a spinner, progress bar, or any other suitable UI element */}
            <p className="text-black text-6xl">Loading...</p>
          </div>
        ) :
        searchResults.flat().length > 0 ? (
  <div className="m-5">
    <h2 className="text-2xl font-bold mb-3">Search Results:</h2>
    <ul className="list-none grid md:grid-cols-6 gap-5 grid-cols-1">
      {searchResults
        .flat()
        .slice(0, displayedProducts) 
        .map((result, index) => (
          <li key={index} className="flex shadow-lg items-start">
            <ProductCard product={result} />
          </li>
        ))}
    </ul>
    {searchResults.flat().length > displayedProducts && (
      <div className="flex justify-center mt-5">
        <button
          className="text-blue-500 p-2 rounded hover:text-blue-900 focus:outline-none shadow-md"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      </div>
    )}
  </div>
) : ( <div className="m-5">
<h2 className="text-3xl font-bold font-serif mt-6 mb-3 text-center ">Trending</h2>
<SquishyCard/>
</div>)
}

      </div>
    </>
  );
};

export default Home;
