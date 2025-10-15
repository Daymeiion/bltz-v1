// Database types for Supabase
export type UserRole = "player" | "fan" | "admin";
export type InviteStatus = "pending" | "accepted" | "declined" | "expired";

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  player_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerTeammate {
  id: string;
  player_id: string;
  teammate_player_id: string;
  games_played_together: number | null;
  last_played_together: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamInvite {
  id: string;
  inviter_user_id: string;
  inviter_player_id: string | null;
  invitee_email: string;
  invitee_name: string | null;
  status: InviteStatus;
  invite_code: string;
  message: string | null;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      player_teammates: {
        Row: PlayerTeammate;
        Insert: Omit<PlayerTeammate, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PlayerTeammate, "id" | "created_at" | "updated_at">>;
      };
      team_invites: {
        Row: TeamInvite;
        Insert: Omit<TeamInvite, "id" | "invite_code" | "created_at" | "updated_at">;
        Update: Partial<Omit<TeamInvite, "id" | "invite_code" | "created_at" | "updated_at">>;
      };
    };
  };
}

