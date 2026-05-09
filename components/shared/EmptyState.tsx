import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

interface EmptyStateProps {
  searchQuery?: string;
  onAddGroup?: () => void;
}

export function EmptyState({ searchQuery, onAddGroup }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No communities found</h3>
      {searchQuery ? (
        <p className="text-gray-500 mb-6">
          No results for "{searchQuery}" yet.
        </p>
      ) : (
        <p className="text-gray-500 mb-6">
          Be the first to add a community to Grouply!
        </p>
      )}
      {onAddGroup && (
        <Button onClick={onAddGroup} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add a group
        </Button>
      )}
    </div>
  );
}