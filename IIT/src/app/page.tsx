"use client";
import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
// import products from "./components/products/page";
import ProductCard from "@/components/product-card";
import { motion } from "framer-motion";
import { IoMdArrowDropdownCircle } from "react-icons/io";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Array<Product>>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  interface Product {
    id: number;
    title: string;
    cost: number;
    description: string;
    imageUrl: string;
  }

  const handleSearch = async() => {
    try {
      // Fetch data from the API
      const response = await fetch("http://localhost:3100/search");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      // Parse the response into JSON
      const data: Product[] = await response.json();

      // Filter the products based on the search term
      // const filteredResults = data.filter((product) =>
      //   product.title.toLowerCase().includes(searchTerm.toLowerCase())
      // );

      // Set the search results
      setSearchResults(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
            // initial={{ opacity: 0, y: -20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 1, duration: 1, type: 'spring', stiffness: 120 }}
            className="absolute bottom-10 transform translate-y-1/2 animate-bounce"
          >
            <span className="text-4xl cursor-pointer">
              <IoMdArrowDropdownCircle />
            </span>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-800/90 to-neutral-950/0" />
      <div
        ref={resultsRef}
        className=" flex flex-col items-center justify-center] min-h-screen "
      >
        <h2 className="text-black text-3xl m-3 mb-8 font-serif">
          Discover top-quality products for an enhanced shopping experience
        </h2>
        <Image
          src="/Images/mascot.png"
          alt="mascot"
          width={150}
          height={150}
          className="rounded-full shadow-lg mb-10"
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
        {/* <div className="mt-5 flex">
          <button className="mr-4 text-sm text-blue-700 hover:underline focus:outline-none">
            Meow Search
          </button>
          <button className="text-sm text-blue-700 hover:underline focus:outline-none">
            I'm Feeling Meowy
          </button>
        </div> */}

        {searchResults.flat().length > 0 ? (
          <div ref={resultsRef} className="m-5">
            <h2 className="text-2xl font-bold mb-3">Search Results:</h2>
            <ul className="list-none grid md:grid-cols-6 gap-5 grid-cols-1">
            {searchResults.flat().map((result, index) => (
        <li key={index} className="flex shadow-lg items-center">
          <ProductCard product={result} />
        </li>
      ))}
            </ul>
          </div>
        ) : (
          <div className="m-5">
            <h2 className="text-2xl font-bold mb-3">No products found</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
