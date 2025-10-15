import { createClient } from "@/lib/supabase/server";

export type UserRole = "player" | "fan" | "admin";

export interface UserProfile {
  id: string;
  email: string | null;
  role: UserRole;
  display_name?: string | null;
  avatar_url?: string | null;
  player_id?: string | null;
}

/**
 * Get the current user's profile with role information
 * Fetches from the existing profiles table in Supabase
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return null;
  }

  // Fetch user profile from profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    // If profile doesn't exist, return basic user info with default role
    return {
      id: user.id,
      email: user.email || null,
      role: "fan" as UserRole, // Default role
    };
  }

  return {
    id: profile.id,
    email: profile.email || user.email || null,
    role: profile.role as UserRole,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    player_id: profile.player_id,
  };
}

/**
 * Check if the current user has the required role(s)
 */
export async function hasRole(allowedRoles: UserRole | UserRole[]): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    return false;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(profile.role);
}

/**
 * Check if the current user is a player
 */
export async function isPlayer(): Promise<boolean> {
  return hasRole("player");
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("Unauthorized");
  }
}

/**
 * Require specific role(s) - throws error if user doesn't have required role
 */
export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const hasRequiredRole = await hasRole(allowedRoles);
  if (!hasRequiredRole) {
    throw new Error("Forbidden - Insufficient permissions");
  }
}

