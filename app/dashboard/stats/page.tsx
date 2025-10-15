import { redirect } from "next/navigation";
import { getCurrentUserProfile, isPlayer } from "@/lib/rbac";
import { getPlayerRankings, getPlayerRank } from "@/lib/queries/dashboard";
import { createClient } from "@/lib/supabase/server";
import { IconTrophy, IconVideo, IconClock, IconUsers } from "@tabler/icons-react";

export default async function StatsPage() {
  const profile = await getCurrentUserProfile();
  
  if (!profile || !(await isPlayer())) {
    redirect("/auth/login");
  }

  // Get player ID
  const supabase = await createClient();
  const { data: player } = await supabase
    .from('players')
    .select('id, name, full_name')
    .eq('user_id', profile.id)
    .single();

  const playerId = player?.id || profile.player_id;

  if (!playerId) {
    redirect("/dashboard/profile?setup=true");
  }

  // Get rankings and current player rank
  const [rankings, currentRank] = await Promise.all([
    getPlayerRankings(20),
    getPlayerRank(playerId),
  ]);

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bltz-navy))] via-[#000000] to-[#000000] p-4 md:p-8 scrollbar-hide">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-10">
          <div className="absolute -top-2 -left-2 w-64 h-64 bg-bltz-blue/10 rounded-full blur-3xl" />
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Statistics & <span className="text-gradient-blue-gold">Rankings</span>
            </h1>
            <p className="text-bltz-white/70 text-lg font-medium">
              See how you stack up against other players
            </p>
          </div>
        </div>

        {/* Current Player Rank Card */}
        {currentRank > 0 && (
          <div className="relative group mb-8">
            <div className="relative bg-gradient-to-br from-bltz-blue to-bltz-gold rounded-md p-8 text-white card-hover border-2 border-gray-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-bltz-white/90 mb-2 text-sm font-bold uppercase tracking-wider">Your Current Rank</p>
                  <h2 className="text-5xl font-black mb-2">#{currentRank}</h2>
                  <p className="text-bltz-white/90 font-bold text-lg">{player?.full_name || player?.name || "Your Profile"}</p>
                </div>
                <IconTrophy className="w-20 h-20 opacity-40" />
              </div>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="bg-black/40 backdrop-blur-md rounded-md border-2 border-gray-600/50 overflow-hidden card-hover">
          <div className="p-8 border-b border-bltz-blue/20">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <span className="w-1 h-8 bg-bltz-gold rounded-full" />
              Top Players Leaderboard
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-bltz-white/70 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-bltz-white/70 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-bltz-white/70 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <IconVideo className="w-4 h-4" />
                      Videos
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-bltz-white/70 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <IconUsers className="w-4 h-4" />
                      Views
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-bltz-white/70 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <IconClock className="w-4 h-4" />
                      Watch Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-bltz-white/70 uppercase tracking-wider">
                    Followers
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bltz-blue/20">
                {rankings.map((ranking, index) => {
                  const isCurrentPlayer = ranking.player_id === playerId;
                  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-orange-600'];
                  const showMedal = index < 3;

                  return (
                    <tr 
                      key={ranking.player_id}
                      className={`
                        ${isCurrentPlayer ? 'bg-bltz-blue/20' : 'hover:bg-bltz-blue/10'}
                        transition-colors
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {showMedal ? (
                            <IconTrophy className={`w-6 h-6 ${medalColors[index]}`} />
                          ) : (
                            <span className="text-lg font-black text-white">
                              #{ranking.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-black ${isCurrentPlayer ? 'text-bltz-gold' : 'text-white'}`}>
                          {ranking.player_name}
                          {isCurrentPlayer && (
                            <span className="ml-2 text-xs text-bltz-gold">(You)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-bltz-white/70 font-bold">
                        {ranking.video_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-bltz-white/70 font-bold">
                        {ranking.total_views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-bltz-white/70 font-bold">
                        {formatWatchTime(ranking.total_watch_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-bltz-white/70 font-bold">
                        {ranking.follower_count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {rankings.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-bltz-white/50 font-medium">No rankings available yet</p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-black/40 backdrop-blur-md rounded-md border-2 border-gray-600/50 p-6 card-hover">
            <h3 className="text-sm font-black text-bltz-white uppercase tracking-wider mb-3">
              Ranking Criteria
            </h3>
            <p className="text-sm text-bltz-white/70 font-medium leading-relaxed">
              Rankings are based on total video views. Keep uploading quality content to climb the leaderboard!
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-md border-2 border-gray-600/50 p-6 card-hover">
            <h3 className="text-sm font-black text-bltz-white uppercase tracking-wider mb-3">
              Updates
            </h3>
            <p className="text-sm text-bltz-white/70 font-medium leading-relaxed">
              Rankings are updated in real-time as views and engagement change across the platform.
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-md border-2 border-gray-600/50 p-6 card-hover">
            <h3 className="text-sm font-black text-bltz-white uppercase tracking-wider mb-3">
              Improve Your Rank
            </h3>
            <p className="text-sm text-bltz-white/70 font-medium leading-relaxed">
              Upload more videos, engage with your audience, and promote your content to boost your ranking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

