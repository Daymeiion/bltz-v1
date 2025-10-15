import { Suspense } from "react";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";
import { getDashboardStats, getRecentVideos, getRecentActivity, getPerformanceStats } from "@/lib/queries/dashboard";
import { getCurrentUserProfile } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Player Dashboard | BLTZ",
  description: "Your personal athlete dashboard",
};

// Daily motivational quotes
const quotes = [
  { text: "The only way to prove that you're a good sport is to lose.", author: "Ernie Banks" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "The difference between the impossible and the possible lies in determination.", author: "Tommy Lasorda" },
];

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default async function DashboardPage() {
  // Get user profile
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect("/auth/login");
  }

  // Get player ID
  const supabase = await createClient();
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', profile.id)
    .single();

  const playerId = player?.id || profile.player_id;

  if (!playerId) {
    // Redirect to profile setup if no player ID
    redirect("/dashboard/setup");
  }

  // Get a random quote for today
  const todayQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // Fetch dashboard data
  const [stats, videos, activities, performanceData] = await Promise.all([
    getDashboardStats(playerId),
    getRecentVideos(playerId, 3),
    getRecentActivity(playerId, profile.id),
    getPerformanceStats(playerId, 'week'),
  ]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient 
        initialStats={stats}
        initialVideos={videos}
        initialActivities={activities}
        initialPerformanceData={performanceData}
        dailyQuote={todayQuote.text}
        quoteAuthor={todayQuote.author}
      />
    </Suspense>
  );
}
