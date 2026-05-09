"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Container } from "@/components/shared/Container";
import { Loader } from "@/components/shared/Loader";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  Copy,
  Check,
  Flag,
  Share2,
  Sparkles,
  ArrowLeft
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
  platform: string;
  platformUrl: string;
  tags: string[];
  memberCount: number;
  imageUrl: string | null;
  isVerified: boolean;
  createdAt: string;
}

export default function GroupDetailPage() {
  const { id } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [similarGroups, setSimilarGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch(`/api/groups/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        // Fetch similar groups based on tags
        if (data.tags && data.tags.length > 0) {
          fetch(`/api/groups/similar?tags=${data.tags.join(",")}&exclude=${id}`)
            .then((res) => res.json())
            .then(setSimilarGroups)
            .catch(console.error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch group:", error);
        setLoading(false);
      });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platformColors: Record<string, string> = {
    discord: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    whatsapp: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    telegram: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  const platformIcons: Record<string, string> = {
    discord: "🎮",
    whatsapp: "💬",
    telegram: "✈️",
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20">
          <Loader />
        </main>
        <BottomNav />
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20">
          <Container>
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold mb-4">Group not found</h1>
              <p className="text-gray-500 mb-6">The community you're looking for doesn't exist.</p>
              <Link href="/">
                <Button className="rounded-full">← Back to Home</Button>
              </Link>
            </div>
          </Container>
        </main>
        <BottomNav />
      </>
    );
  }

  const platform = group.platform?.toLowerCase() || "default";
  const colorClass = platformColors[platform] || platformColors.default;
  const icon = platformIcons[platform] || "💬";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-24">
        <Container>
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-6 transition">
            <ArrowLeft className="w-4 h-4" />
            Back to all communities
          </Link>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold">
                  {group.imageUrl ? (
                    <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    group.name.charAt(0)
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold">{group.name}</h1>
                    <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 bg-white/20 backdrop-blur`}>
                      <span>{icon}</span> {group.platform}
                    </span>
                    {group.isVerified && <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-90 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {group.memberCount.toLocaleString()} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Button
                  variant="secondary"
                  className="rounded-full bg-white/20 hover:bg-white/30 text-white"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Share"}
                </Button>
                <Button
                  className="rounded-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
                  onClick={() => window.open(group.platformUrl, "_blank")}
                >
                  Join Community <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - About */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About this community</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {group.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/?search=${tag}`}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-600 transition"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => window.open(group.platformUrl, "_blank")}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Join on {group.platform}
                    </Button>
                    <Button variant="outline" className="w-full rounded-full">
                      <Flag className="w-4 h-4 mr-2" />
                      Report this group
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Communities */}
              {similarGroups.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Similar Communities
                    </h3>
                    <div className="space-y-3">
                      {similarGroups.map((sg) => (
                        <Link href={`/group/${sg.id}`} key={sg.id}>
                          <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition">
                            <div>
                              <p className="font-medium text-sm">{sg.name}</p>
                              <p className="text-xs text-gray-500">{sg.memberCount.toLocaleString()} members</p>
                            </div>
                            <Button size="sm" variant="ghost" className="rounded-full text-purple-600">
                              View →
                            </Button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </main>
      <BottomNav />
    </>
  );
}