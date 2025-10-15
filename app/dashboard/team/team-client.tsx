"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InviteModal } from "@/components/team/InviteModal";
import { AddTeammateModal } from "@/components/team/AddTeammateModal";
import { 
  UserPlus, 
  Mail, 
  Users, 
  Loader2, 
  MoreVertical,
  Calendar,
  Trophy,
  ExternalLink,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Teammate {
  id: string;
  player_id: string;
  teammate_player_id: string;
  games_played_together: number | null;
  last_played_together: string | null;
  teammate: {
    id: string;
    name: string | null;
    full_name: string | null;
    profile_image: string | null;
    position: string | null;
    team: string | null;
    slug: string | null;
    user_id: string | null;
  };
}

interface Invite {
  id: string;
  invitee_email: string;
  invitee_name: string | null;
  status: string;
  created_at: string;
  expires_at: string | null;
}

export function TeamPageClient() {
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddTeammateModal, setShowAddTeammateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"teammates" | "invites">("teammates");

  const fetchTeammates = async () => {
    try {
      const response = await fetch("/api/team/teammates");
      const data = await response.json();
      
      if (response.ok) {
        setTeammates(data.teammates || []);
      }
    } catch (error) {
      console.error("Error fetching teammates:", error);
      toast.error("Failed to load teammates");
    }
  };

  const fetchSentInvites = async () => {
    try {
      const response = await fetch("/api/team/invites?type=sent");
      const data = await response.json();
      
      if (response.ok) {
        setSentInvites(data.invites || []);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const handleRemoveTeammate = async (teammateId: string) => {
    if (!confirm("Are you sure you want to remove this teammate?")) {
      return;
    }

    try {
      const response = await fetch(`/api/team/teammates?id=${teammateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Teammate removed");
        fetchTeammates();
      } else {
        throw new Error("Failed to remove teammate");
      }
    } catch (error) {
      console.error("Error removing teammate:", error);
      toast.error("Failed to remove teammate");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTeammates(), fetchSentInvites()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-bltz-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bltz-navy))] via-[#000000] to-[#000000] p-6 md:p-10 scrollbar-hide">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-10">
          <div className="absolute -top-2 -left-2 w-64 h-64 bg-bltz-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-2 -right-2 w-72 h-72 bg-bltz-blue/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                Your <span className="text-gradient-blue-gold">Squad</span>
              </h1>
              <p className="text-bltz-white/70 text-lg font-medium">
                Connect with teammates and invite others to join bltz
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAddTeammateModal(true)}
                className="btn-primary"
              >
                <UserPlus className="w-5 h-5" />
                Add Teammate
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-6 py-3 border-2 border-bltz-gold/50 hover:border-bltz-gold hover:bg-bltz-gold/10 text-bltz-gold rounded-md font-bold transition-all duration-300"
              >
                <Mail className="w-5 h-5 inline mr-2" />
                Invite to bltz
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative group">
            <div className="relative p-4 bg-gray-600/40 backdrop-blur-md rounded-md border-2 border-gray-600/50 card-hover">
              <div className="flex flex-col items-center mb-1">
                <div className="mb-1">
                  <Users className="h-8 w-8 text-bltz-blue-light" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-bltz-white/70 uppercase tracking-wider mb-2 text-center">Total Teammates</h3>
              <p className="text-4xl font-black text-white text-center">{teammates.length}</p>
            </div>
          </div>

          <div className="relative group">
            <div className="relative p-4 bg-gray-600/40 backdrop-blur-md rounded-md border-2 border-gray-600/50 card-hover">
              <div className="flex flex-col items-center mb-1">
                <div className="mb-1">
                  <Mail className="h-8 w-8 text-bltz-gold" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-bltz-white/70 uppercase tracking-wider mb-2 text-center">Pending Invites</h3>
              <p className="text-4xl font-black text-white text-center">
                {sentInvites.filter((inv) => inv.status === "pending").length}
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="relative p-4 bg-gray-600/40 backdrop-blur-md rounded-md border-2 border-gray-600/50 card-hover">
              <div className="flex flex-col items-center mb-1">
                <div className="mb-1">
                  <Trophy className="h-8 w-8 text-bltz-blue-light" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-bltz-white/70 uppercase tracking-wider mb-2 text-center">Games Together</h3>
              <p className="text-4xl font-black text-white text-center">
                {teammates.reduce((sum, t) => sum + (t.games_played_together || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("teammates")}
            className={`px-8 py-4 rounded-md font-black text-lg transition-all duration-300 ${
              activeTab === "teammates"
                ? "bg-gradient-to-r from-bltz-blue to-bltz-blue-light text-white shadow-lg shadow-bltz-blue/50"
                : "bg-black/40 text-bltz-white/60 hover:bg-black/60 border-2 border-bltz-blue/20"
            }`}
          >
            Teammates ({teammates.length})
          </button>
          <button
            onClick={() => setActiveTab("invites")}
            className={`px-8 py-4 rounded-md font-black text-lg transition-all duration-300 ${
              activeTab === "invites"
                ? "bg-gradient-to-r from-bltz-gold to-bltz-gold-light text-bltz-black shadow-lg shadow-bltz-gold/50"
                : "bg-black/40 text-bltz-white/60 hover:bg-black/60 border-2 border-bltz-gold/20"
            }`}
          >
            Invites ({sentInvites.length})
          </button>
        </div>

        {/* Teammates Tab */}
        {activeTab === "teammates" && (
          <>
            {teammates.length === 0 ? (
              <div className="bg-black/40 backdrop-blur-md rounded-md border-2 border-bltz-blue/30 p-16 text-center">
                <Users className="w-24 h-24 mx-auto mb-6 text-bltz-blue/50" />
                <h3 className="text-2xl font-black text-white mb-3">
                  No teammates yet
                </h3>
                <p className="text-bltz-white/70 mb-8 text-lg">
                  Start building your squad by adding players you&apos;ve played with
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowAddTeammateModal(true)}
                    className="btn-primary"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Teammate
                  </button>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-6 py-3 border-2 border-bltz-gold/50 hover:border-bltz-gold hover:bg-bltz-gold/10 text-bltz-gold rounded-md font-bold transition-all duration-300"
                  >
                    <Mail className="w-5 h-5 inline mr-2" />
                    Invite to bltz
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teammates.map((teammate) => (
                  <div 
                    key={teammate.id} 
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-bltz-blue/20 blur-xl group-hover:blur-2xl transition-all rounded-md" />
                    <div className="relative bg-black/60 backdrop-blur-md rounded-md border-2 border-bltz-blue/30 overflow-hidden card-hover">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-14 w-14 border-2 border-bltz-gold">
                              <AvatarImage 
                                src={teammate.teammate.profile_image || undefined} 
                                alt={teammate.teammate.name || ""} 
                              />
                              <AvatarFallback className="bg-gradient-to-br from-bltz-blue to-bltz-gold text-white font-black text-xl">
                                {(teammate.teammate.name || teammate.teammate.full_name || "?")
                                  .charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-white text-lg truncate">
                                {teammate.teammate.full_name || teammate.teammate.name}
                              </h3>
                              <p className="text-sm text-bltz-gold font-bold uppercase tracking-wider truncate">
                                {teammate.teammate.position}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-bltz-blue/20 rounded-lg transition-colors">
                                <MoreVertical className="h-5 w-5 text-bltz-white/70" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-bltz-navy border-bltz-blue/50">
                              <DropdownMenuItem 
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                onClick={() => handleRemoveTeammate(teammate.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-3 mb-4">
                          {teammate.teammate.team && (
                            <div className="flex items-center gap-2 text-sm text-bltz-white/70">
                              <Trophy className="h-4 w-4 text-bltz-gold" />
                              <span className="truncate font-medium">{teammate.teammate.team}</span>
                            </div>
                          )}
                          {teammate.games_played_together !== null && teammate.games_played_together > 0 && (
                            <div className="flex items-center gap-2 text-sm text-bltz-white/70">
                              <Users className="h-4 w-4 text-bltz-blue" />
                              <span className="font-medium">{teammate.games_played_together} games together</span>
                            </div>
                          )}
                          {teammate.last_played_together && (
                            <div className="flex items-center gap-2 text-sm text-bltz-white/70">
                              <Calendar className="h-4 w-4 text-bltz-blue-light" />
                              <span className="font-medium">
                                {formatDistanceToNow(new Date(teammate.last_played_together), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          )}
                        </div>

                        {teammate.teammate.slug && (
                          <Link href={`/player/${teammate.teammate.slug}`}>
                            <button className="w-full px-4 py-3 bg-bltz-blue/20 hover:bg-bltz-blue/30 text-bltz-blue rounded-md font-bold transition-all flex items-center justify-center gap-2 border border-bltz-blue/30">
                              <ExternalLink className="h-4 w-4" />
                              View Profile
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Invites Tab */}
        {activeTab === "invites" && (
          <>
            {sentInvites.length === 0 ? (
              <div className="bg-black/40 backdrop-blur-md rounded-md border-2 border-bltz-gold/30 p-16 text-center">
                <Mail className="w-24 h-24 mx-auto mb-6 text-bltz-gold/50" />
                <h3 className="text-2xl font-black text-white mb-3">
                  No invites sent
                </h3>
                <p className="text-bltz-white/70 mb-8 text-lg">
                  Invite teammates who aren&apos;t on bltz yet
                </p>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="btn-gold"
                >
                  <Mail className="w-5 h-5 inline mr-2" />
                  Send Invite
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sentInvites.map((invite) => (
                  <div 
                    key={invite.id}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-bltz-gold/20 blur-xl group-hover:blur-2xl transition-all rounded-md" />
                    <div className="relative bg-black/60 backdrop-blur-md rounded-md border-2 border-bltz-gold/30 p-6 card-hover">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-bltz-gold">
                            <AvatarFallback className="bg-gradient-to-br from-bltz-gold to-bltz-gold-dark text-bltz-black font-black text-lg">
                              {(invite.invitee_name || invite.invitee_email)
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-black text-white text-lg">
                              {invite.invitee_name || invite.invitee_email}
                            </div>
                            {invite.invitee_name && (
                              <div className="text-sm text-bltz-white/70 font-medium">
                                {invite.invitee_email}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider ${
                              invite.status === "accepted"
                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                : invite.status === "pending"
                                ? "bg-bltz-gold/20 text-bltz-gold border border-bltz-gold/50"
                                : "bg-red-500/20 text-red-400 border border-red-500/50"
                            }`}
                          >
                            {invite.status}
                          </span>
                          <div className="text-xs text-bltz-white/50 mt-2 font-medium">
                            Sent {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <InviteModal
          open={showInviteModal}
          onOpenChange={setShowInviteModal}
          onInviteSent={fetchSentInvites}
        />
        <AddTeammateModal
          open={showAddTeammateModal}
          onOpenChange={setShowAddTeammateModal}
          onTeammateAdded={fetchTeammates}
        />
      </div>
    </div>
  );
}
