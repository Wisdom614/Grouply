"use client";

import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
        Find your people.
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Discover communities that match your interests
      </p>
    </div>
  );
}