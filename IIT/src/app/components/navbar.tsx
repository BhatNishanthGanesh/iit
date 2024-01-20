"use client";
import React, { useState,useEffect } from "react";
import { FiMenu, FiArrowRight, FiX, FiChevronDown } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import Fav from "../fav/page";
// import { roboto_mono } from "@/app/layout";
import {
  useMotionValueEvent,
  AnimatePresence,
  useScroll,
  motion,
} from "framer-motion";
import Link from "next/link";

export const Example = () => {
  return (
    <>
      <FlyoutNav />
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/Images/sloganBanner.png"
            alt="Slogan Banner"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-800/90 to-neutral-950/0" />
    </>
  );
};

export const FlyoutNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 250 ? true : false);
  });

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-6 text-white 
      transition-all duration-300 ease-out lg:px-12
      ${
        scrolled
          ? "bg-neutral-950 py-3 shadow-xl"
          : "bg-neutral-950/0 py-6 shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo />
        <div className="hidden gap-6 lg:flex">
          <SignUp />
          <Favour />
        </div>
        <MobileMenu />
      </div>
    </nav>
  );
};

const Logo = ({ color = "white" }) => {
  // Temp logo from https://logoipsum.com/
  const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 250; // You can adjust the scroll threshold here
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="flex items-center  gap-2">
    <Link href={"/"} className="flex items-center">
    {/* <div className={`relative ${isScrolled ? 'bg-neutral-600' : 'bg-black'} w-24 rounded-full h-12`}>
        <Image
          src="/Images/navbg.png"
          alt="Mascot"
          layout="fill"
          objectFit="contain"
          className="rounded-full"
        />
      </div> */}
      <span className="text-2xl cursor-pointer font-bold" style={{ color }}>
        WiseBuy.com
      </span>
    </Link>
  </div>
  
  
  );
};

const SignUp = () => {
  return (
    <>
      <button
        className={`
          relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] 
          border-neutral-700 px-4 py-1.5 font-medium
         text-white transition-all duration-300 w-full pr-6
          before:absolute before:inset-0
          before:-z-10 before:translate-y-[200%]
          before:scale-[2.5]
          before:rounded-[100%] before:bg-neutral-50
          before:transition-transform before:duration-1000
          before:content-[""]
  
          hover:scale-105 hover:border-neutral-50 hover:text-neutral-900
          hover:before:translate-y-[0%]
          active:scale-100`}
      >
        Sign In
      </button>
    </>
  );
};

const Favour = () => {
  return (
    <>
      <button
        className={`
          relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] 
          border-neutral-700 px-4 py-1.5 font-medium
         text-white transition-all duration-300 w-full pr-6
          
          before:absolute before:inset-0
          before:-z-10 before:translate-y-[200%]
          before:scale-[2.5]
          before:rounded-[100%] before:bg-red-600
          before:transition-transform before:duration-1000
          before:content-[""]
  
          hover:scale-105 hover:border-red-800 hover:text-neutral-900
          hover:before:translate-y-[0%]
          active:scale-100`}
      >
        <Link href="/fav">Favourities</Link>
      </button>
    </>
  );
};

const MobileMenuLink = ({ children, href, FoldContent, setMenuOpen }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative text-neutral-950">
      {FoldContent ? (
        <div
          className="flex w-full cursor-pointer items-center justify-between border-b border-neutral-300 py-6 text-start text-2xl font-semibold"
          onClick={() => setOpen((pv) => !pv)}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
            href={href}
          >
            {children}
          </a>
          <motion.div
            animate={{ rotate: open ? "180deg" : "0deg" }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <FiChevronDown />
          </motion.div>
        </div>
      ) : (
        <a
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(false);
          }}
          href="#"
          className="flex w-full cursor-pointer items-center justify-between border-b border-neutral-300 py-6 text-start text-2xl font-semibold"
        >
          <span>{children}</span>
          <FiArrowRight />
        </a>
      )}
      {FoldContent && (
        <motion.div
          initial={false}
          animate={{
            height: open ? "fit-content" : "0px",
            marginBottom: open ? "24px" : "0px",
            marginTop: open ? "12px" : "0px",
          }}
          className="overflow-hidden"
        >
          <FoldContent />
        </motion.div>
      )}
    </div>
  );
};

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="block lg:hidden">
      <button onClick={() => setOpen(true)} className="block text-3xl">
        <FiMenu />
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "100vw" }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed left-0 top-0 flex h-screen w-full flex-col bg-white"
          >
            <div className="flex items-center justify-between p-6">
              <Logo color="black" />
              <button onClick={() => setOpen(false)}>
                <FiX className="text-3xl text-neutral-950" />
              </button>
            </div>
            <div className="flex justify-end p-6">
              <Favour />
            </div>
            <div className="flex justify-end p-6">
              <SignUp />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};
