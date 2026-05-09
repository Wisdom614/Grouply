"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, ExternalLink } from "lucide-react";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    platform: string;
    platformUrl: string;
    tags: string[];
    memberCount: number;
    imageUrl: string | null;
    isVerified?: boolean;
  };
}

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

export function GroupCard({ group }: GroupCardProps) {
  const platform = group.platform?.toLowerCase() || "default";
  const colorClass = platformColors[platform] || platformColors.default;
  const icon = platformIcons[platform] || "💬";

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(group.platformUrl, "_blank");
  };

  return (
    <Link href={`/group/${group.id}`}>
      <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* Image/Icon */}
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              {group.imageUrl ? (
                <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">{group.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Title & Platform Badge */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-lg truncate">{group.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${colorClass}`}>
                  <span>{icon}</span> {group.platform}
                </span>
                {group.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {group.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {group.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
                {group.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{group.tags.length - 3} more</span>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-3 h-3" />
                  {group.memberCount.toLocaleString()} members
                </div>
                <Button
                  size="sm"
                  className="rounded-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition"
                  onClick={handleJoinClick}
                >
                  Join group <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}