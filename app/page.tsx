"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchBar } from "@/components/home/SearchBar";
import { TrendingTags } from "@/components/home/TrendingTags";
import { GroupCard } from "@/components/groups/GroupCard";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Container } from "@/components/shared/Container";

interface Group {
  id: string;
  name: string;
  description: string;
  platform: string;
  platformUrl: string;
  tags: string[];
  memberCount: number;
  imageUrl: string | null;
  isVerified?: boolean;
}

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setFilteredGroups(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch groups:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery, groups]);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-20 md:pb-0">
        <Container>
          <HeroSection />
          <SearchBar onSearch={setSearchQuery} />
          <TrendingTags onTagClick={handleTagClick} />

          {loading ? (
            <Loader />
          ) : filteredGroups.length === 0 ? (
            <EmptyState searchQuery={searchQuery} onAddGroup={() => (window.location.href = "/add")} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <BottomNav />
    </>
  );
}