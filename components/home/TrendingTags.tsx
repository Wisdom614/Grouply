"use client";

const trendingTags = [
  { name: "Programming", count: "12k+" },
  { name: "Gaming", count: "8.5k+" },
  { name: "Business", count: "6.2k+" },
  { name: "Prayer", count: "4.8k+" },
  { name: "Crypto", count: "3.1k+" },
  { name: "Students", count: "9.4k+" },
  { name: "Anime", count: "5.7k+" },
  { name: "Music", count: "7.3k+" },
];

interface TrendingTagsProps {
  onTagClick: (tag: string) => void;
}

export function TrendingTags({ onTagClick }: TrendingTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center my-8">
      {trendingTags.map((tag) => (
        <button
          key={tag.name}
          onClick={() => onTagClick(tag.name.toLowerCase())}
          className="group px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 hover:shadow-md transition-all duration-200"
        >
          <span className="text-sm font-medium">#{tag.name}</span>
          <span className="text-xs text-gray-500 ml-1">{tag.count}</span>
        </button>
      ))}
    </div>
  );
}