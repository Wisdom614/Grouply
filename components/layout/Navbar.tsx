"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Grouply
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition">
              Explore
            </Link>
            <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 transition">
              Categories
            </Link>
            <Link href="/add">
  <Button variant="outline" size="sm" className="rounded-full">
    Add Group
  </Button>
</Link>
            <Button size="sm" className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
              Sign In
            </Button>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b">
          <div className="px-4 py-4 space-y-3">
            <Link href="/explore" className="block py-2 text-gray-600 dark:text-gray-400">Explore</Link>
            <Link href="/categories" className="block py-2 text-gray-600 dark:text-gray-400">Categories</Link>
            <Button variant="outline" className="w-full rounded-full">Add Group</Button>
            <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600">Sign In</Button>
          </div>
        </div>
      )}
    </nav>
  );
}