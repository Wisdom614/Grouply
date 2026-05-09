"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
  platform: string;
  platformUrl: string;
  tags: string[];
  memberCount: number;
  imageUrl: string | null;
}

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        console.log("Fetching groups...");
        const res = await fetch("/api/groups");
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Received data:", data);
        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase()) ||
    group.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleJoin = (platformUrl: string) => {
    if (platformUrl) {
      window.open(platformUrl, '_blank');
    } else {
      console.warn("No platform URL provided");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
            Find your people.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Discover communities that match your interests
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search communities... (try: programming, gaming, prayer)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {["Programming", "Gaming", "Business", "Prayer", "Crypto", "Students"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearch(tag.toLowerCase())}
              className="px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 hover:shadow-md transition-all text-sm font-medium"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-500">Loading amazing communities...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-4">
              {search ? `No communities found for "${search}" yet.` : "No communities added yet."}
            </p>
            <Button 
              className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => window.location.href = '/add-group'}
            >
              Be the first to add one →
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-32 bg-gradient-to-r from-purple-500 to-blue-500">
                    {group.imageUrl && (
                      <img
                        src={group.imageUrl}
                        className="w-full h-full object-cover"
                        alt={group.name}
                      />
                    )}
                    <div className="absolute -bottom-6 left-4">
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center text-2xl">
                        {group.platform === "discord" && "🎮"}
                        {group.platform === "whatsapp" && "💬"}
                        {group.platform === "telegram" && "✈️"}
                        {!group.platform && "👥"}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-8">
                    <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {group.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {group.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-3 h-3" />
                        {group.memberCount.toLocaleString()} members
                      </div>
                      <Button 
                        size="sm" 
                        className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => handleJoin(group.platformUrl)}
                      >
                        Join →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}