"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string | null;
  full_name: string | null;
  profile_image: string | null;
  position: string | null;
  team: string | null;
  slug: string | null;
}

interface AddTeammateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeammateAdded?: () => void;
}

export function AddTeammateModal({ open, onOpenChange, onTeammateAdded }: AddTeammateModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Debounced search
  const searchPlayers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/team/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.players || []);
      } else {
        console.error("Search error:", data.error);
      }
    } catch (error) {
      console.error("Error searching players:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlayers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchPlayers]);

  const handleAddTeammate = async (player: Player) => {
    setIsAdding(true);
    try {
      const response = await fetch("/api/team/teammates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teammate_player_id: player.id,
          games_played_together: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add teammate");
      }

      toast.success(`Added ${player.name || player.full_name} as a teammate!`);
      onTeammateAdded?.();
      onOpenChange(false);
      
      // Reset
      setSearchQuery("");
      setSearchResults([]);
      setSelectedPlayer(null);
    } catch (error) {
      console.error("Error adding teammate:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add teammate");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a Teammate</DialogTitle>
          <DialogDescription>
            Search for players you&apos;ve played with who are already on bltz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search for Players</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {searchQuery.length < 2 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Start typing to search for players...
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No players found. Make sure they&apos;re already signed up on bltz.
              </div>
            )}

            {searchResults.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                  selectedPlayer?.id === player.id && "bg-accent border-primary"
                )}
                onClick={() => setSelectedPlayer(player)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={player.profile_image || undefined} alt={player.name || ""} />
                  <AvatarFallback>
                    {(player.name || player.full_name || "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {player.full_name || player.name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {[player.position, player.team].filter(Boolean).join(" • ")}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTeammate(player);
                  }}
                  disabled={isAdding}
                >
                  {isAdding && selectedPlayer?.id === player.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

