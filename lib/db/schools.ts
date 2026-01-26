import { createClient } from "@/lib/supabase/server";
import type { SchoolSearchOptions, PendingContext } from "@/types/schools";

export async function searchSchoolsAutocomplete(
  query: string,
  opts: SchoolSearchOptions = {}
) {
  const supabase = createClient();

  const {
    limit = 12,
    league = "NCAA",
    orgType = "college",
    division = null,
  } = opts;

  const { data, error } = await supabase.rpc(
    "search_schools_autocomplete",
    {
      q: query,
      result_limit: limit,
      league_filter: league,
      org_type_filter: orgType,
      division_filter: division,
    }
  );

  if (error) throw error;
  return data ?? [];
}

export async function bestMatchSchool(
  query: string,
  opts: SchoolSearchOptions = {}
) {
  const supabase = createClient();

  const {
    league = "NCAA",
    orgType = "college",
    division = null,
    minScore = 0.35,
  } = opts;

  const { data, error } = await supabase.rpc(
    "best_match_school",
    {
      q: query,
      league_filter: league,
      org_type_filter: orgType,
      division_filter: division,
      min_score: minScore,
    }
  );

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function matchOrCreateSchoolPending(
  query: string,
  opts: SchoolSearchOptions & { context?: PendingContext } = {}
) {
  const supabase = createClient();

  const {
    league = "NCAA",
    orgType = "college",
    division = null,
    minScore = 0.35,
    context = {},
  } = opts;

  const { data, error } = await supabase.rpc(
    "match_or_create_school_pending",
    {
      q: query,
      league_filter: league,
      org_type_filter: orgType,
      division_filter: division,
      min_score: minScore,
      context,
    }
  );

  if (error) throw error;
  return data?.[0] ?? null;
}
