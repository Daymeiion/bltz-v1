import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamPageClient } from "./team-client";

export const metadata = {
  title: "Team | bltz",
  description: "Connect with your teammates on bltz",
};

function TeamPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={<TeamPageSkeleton />}>
      <TeamPageClient />
    </Suspense>
  );
}

