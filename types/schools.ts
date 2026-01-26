export type SchoolSearchOptions = {
  limit?: number;
  league?: "NCAA" | "NFL" | "CFL" | null;
  orgType?: "college" | "pro" | null;
  division?: string | null;
  minScore?: number;
};

export type PendingContext = Record<string, any>;
