import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlayerProfileCard from "@/app/player/PlayerProfileCard";
import { VideoCard } from "@/components/ui/VideoCard";
import Image from "next/image";
import { MOCK_PLAYERS, MOCK_VIDEOS, MOCK_MEDIA } from "@/lib/mock";
import VideoYTRow from "@/components/video/VideoYTRow";
import { MOCK_VIDEOS_YT } from "@/lib/mockVideosYT";
import PlayerHeader from "@/components/player/PlayerHeader";
import { WobbleCard } from "@/components/ui/wobble-card";
import PlayerActionButtons from "@/components/player/PlayerActionButtons";
import BioModal from "@/components/player/BioModal";
import VideoGridModal from "@/components/player/VideoGridModal";
import MobileTabs from "@/components/ui/MobileTabs";
import MediaCarouselModal from "@/components/player/MediaCarouselModal";
import MediaMasonryModal from "@/components/player/MediaMasonryModal";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";

export default async function PlayerLocker({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // -------- MOCK PATH --------
  if (useMock) {
    const player = MOCK_PLAYERS.find((p: any) => p.slug === resolvedParams.slug) ?? MOCK_PLAYERS[0];
    const vids = MOCK_VIDEOS;
    const media = MOCK_MEDIA;

    // Derive dynamic bio/stat fields from mock meta (with sensible fallbacks)
    const mockMeta = (player as any).meta ?? {};
    const dob = mockMeta.dob ?? "1985-08-07"; // YYYY-MM-DD
    const heightIn = mockMeta.height_in ?? 71; // inches
    const weightLbs = mockMeta.weight_lbs ?? 210;
    const gamesPlayed = mockMeta.games_played ?? 116;

    const age = (() => {
      const d = new Date(dob);
      if (isNaN(d.getTime())) return undefined;
      const now = new Date();
      let a = now.getFullYear() - d.getFullYear();
      const m = now.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
      return a;
    })();

    const dobDisplay = (() => {
      const d = new Date(dob);
      if (isNaN(d.getTime())) return "—";
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    })();

    const feet = Math.floor((heightIn ?? 0) / 12);
    const inches = (heightIn ?? 0) % 12;

    return (
      <main className="mx-auto max-w-6xl p-6 relative scrollbar-hide">
        {/* Background with frosted gray and gradient accent (full-screen) */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gray-900/30 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#FFBB00]/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 gap-1 lg:grid-cols-4 lg:gap-8">
          {/* 1/4 column */}
          <aside className="space-y-2 lg:col-span-1 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto scrollbar-hide">
            <PlayerHeader
              fullName="DEMO PLAYER"
              city="Los Angeles, CA"
              videoSrc="/videos/demo-reel.mp4"
              videoPoster="/images/video-thumb.png"
              badgeUrl="/images/SilverHero1.png"
              avatarUrl="/images/Headshot.png"
            />
          </aside>

          {/* 3/4 column */}
          <section className="lg:col-span-3 scrollbar-hide">
            {/* Desktop view - original layout */}
            <div className="hidden lg:block space-y-6">
              {/* Image container above bio */}
              <div className="relative h-48 w-full rounded-t-md overflow-hidden">
                  <Image 
                    src="/images/media-5.jpg" 
                    alt="Player highlight" 
                    fill 
                    className="object-cover" 
                  />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
                <PlayerActionButtons />
              </div>

              {/* Bio (desktop only, placed above Videos) */}
              <div className="space-y-0 -mt-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bebas tracking-widest">Bio</h2>
                </div>
                <div className="rounded-md border border-white/5 bg-white/5 p-2 h-[150px] max-h-[150px] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="grid grid-cols-[1fr_1fr_2fr] gap-1 h-full">
                    {/* Column 1: profile image */}
                    <div className="rounded-md bg-black/20 border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                      <div className="relative w-full aspect-square max-w-[140px]">
                        <Image src="/images/Headshot.png" alt="Profile" fill className="object-cover rounded-md" />
                      </div>
                    </div>

                    {/* Column 2: stats grid */}
                      <div className="flex flex-col gap-1 h-full justify-between">
                       <div className="rounded-md bg-black/20 border border-white/10 p-1 text-white/90 text-center flex items-center justify-center h-full">
                         <div className="text-[8px] opacity-80 inline mr-1 font-oswald">DOB: </div>
                         <div className="text-md font-bebas tracking-wider inline">{dobDisplay}{typeof age === "number" && <span className="opacity-70 text-[10px] ml-1 font-oswald tracking-wider align-baseline">(age {age})</span>}</div>
                        </div>
                       <div className="grid grid-cols-2 gap-1">
                         <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                           <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Height</div>
                           <div className="text-sm font-bold font-bebas tracking-wider">{feet}'{inches}</div>
                         </div>
                         <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                           <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Weight</div>
                           <div className="text-sm font-bold font-bebas tracking-wider">{weightLbs} lbs</div>
                         </div>
                        </div>
                     <div className="grid grid-cols-2 gap-1">
                         <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                             <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Games Played</div>
                             <div className="text-base font-bold leading-[1.25rem] font-bebas tracking-wider">{gamesPlayed}</div>
                         </div>
                         <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                             <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Level</div>
                             <div className="text-base font-bold leading-[1.25rem] font-bebas tracking-wider">Pro</div>
                         </div>
                        </div>
                      </div>

                    {/* Column 3: biography with read more */}
                    <div className="flex flex-col h-full">
                      <div className="flex-1 rounded-md p-2 text-white/90 leading-relaxed overflow-hidden">
                        <p className="text-xxs md:text-xs">
                          This is a short biography about the player. It highlights background, strengths,
                          achievements, and playing style. Replace this placeholder with the player's locker
                          biography pulled from Supabase.
                        </p>
                      </div>
                      <div className="mt-2 flex justify-end">
                          <BioModal 
                            bioText={`Daymeion Dante Hughes (born August 21, 1985) is an American former professional football player who was a cornerback for five seasons in the National Football League (NFL). He played college football for the California Golden Bears, earning consensus All-American honors in 2006. The Indianapolis Colts selected him in the third round of the 2007 NFL draft, and he also played for the NFL's San Diego Chargers.

Early Life
Hughes was born in Los Angeles, California. Tested for Highly Gifted at age 8. Attended Park Western Place Elementary gifted and talented, which is located in San Pedro, California. Went on to attend Crenshaw High School in Los Angeles, and was a letterman in football, basketball, tennis, and track. In football, he was an all-league and an all-city honoree as a junior. As a senior, he was named the Coliseum League's co-Player of the Year. In basketball, he was a two-year starter. On Rivals.com's list of Top 100 California Players, Hughes came in at No. 41 and was subsequently recruited by multiple Pac-10 and Big Ten programs, but eventually landed at Cal.

College Career
Hughes enrolled at the University of California, Berkeley, where he played for California Golden Bears football team from 2003 to 2006. He was recognized as the Lott Trophy winner in 2006 and a consensus first-team All-American while leading the nation in interceptions with eight. He was prolific in breaking up passes and making pinpoint tackles to stop the passer's progress in all four years. Due to his ability to completely shut down one side of the field, he was given the label of a "shutdown corner," a title only given to the best of defensive backs.

Professional Career
After his senior season, he was expected to be an early first day pick in the 2007 NFL draft and one of the first cornerbacks taken. However, slower than expected 40-yard dash times likely led to his selection by the Indianapolis Colts late the third round. Hughes and Tim Jennings competed for the nickel back duties behind projected starter Kelvin Hayden and left corner Marlin Jackson. Hughes finished the season with 14 tackles in only 10 games.

Personal
He is known by his middle name, Dante, to his close friends and family members. He is the son of Ronald and Catana Hughes and graduated with a degree in art practice. Hughes and his art were featured on the sports page of the San Jose Mercury News.`}
                            playerName="Daymeion Dante Hughes"
                            playerLevel="Professional"
                            playerStatus="former"
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Videos */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bebas tracking-widest">Videos</h2>
                  <VideoGridModal playerName={player.full_name} />
                </div>
                <VideoYTRow videos={MOCK_VIDEOS_YT} />
              </div>

              {/* Media */}
              <div className="space-y-3">
                {(() => {
                  const mediaItems = [
                    { id: "1", url: "/images/media-5.jpg", title: "Game Highlight 1", credits: "Photo by John Smith", width: 1600, height: 900 },
                    { id: "2", url: "/images/media-6.jpg", title: "Game Highlight 2", credits: "Photo by Jane Doe", width: 800, height: 1200 },
                    { id: "3", url: "/images/media-1.png", title: "Action Shot", credits: "Photo by Sports Weekly", width: 1200, height: 800 },
                    { id: "4", url: "/images/SilverHero1.png", title: "Team Photo", credits: "Official Team Photo", width: 900, height: 1200 },
                    { id: "5", url: "/images/media-3.png", title: "Championship", credits: "Photo by League Photographer", width: 1200, height: 900 },
                    { id: "6", url: "/images/Headshot.png", title: "Portrait", credits: "Official Headshot", width: 800, height: 1000 },
                    { id: "7", url: "/images/media-2.png", title: "Training Day", credits: "Photo by Team Media", width: 1600, height: 900 },
                    { id: "8", url: "/images/media-5.jpg", title: "Game Highlight 3", credits: "Photo by Team Photographer", width: 800, height: 1200 },
                  ];

                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bebas tracking-widest">Media</h2>
                        <MediaMasonryModal mediaItems={mediaItems}>
                          <button className="text-[#FFBB00] hover:text-[#FFBB00]/80 text-sm underline px-4 uppercase cursor-pointer">
                            SEE ALL
                          </button>
                        </MediaMasonryModal>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {/* First row: 2/3 and 1/3 */}
                        <MediaCarouselModal mediaItems={mediaItems} initialIndex={0}>
                          <WobbleCard containerClassName="h-48 col-span-2 rounded-md bg-transparent cursor-pointer" className="p-0">
                            <div className="relative rounded-md overflow-hidden w-full h-full">
                              <Image src="/images/media-5.jpg" alt="Media 1" fill className="object-cover" />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                            </div>
                          </WobbleCard>
                        </MediaCarouselModal>
                        
                        <MediaCarouselModal mediaItems={mediaItems} initialIndex={1}>
                          <WobbleCard containerClassName="h-48 col-span-1 rounded-md bg-transparent cursor-pointer" className="p-0">
                            <div className="relative rounded-md overflow-hidden w-full h-full">
                              <Image src="/images/media-6.jpg" alt="Media 2" fill className="object-cover" />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                            </div>
                          </WobbleCard>
                        </MediaCarouselModal>
                        
                        {/* Second row: 1/3 and 2/3 */}
                        <MediaCarouselModal mediaItems={mediaItems} initialIndex={2}>
                          <WobbleCard containerClassName="h-48 col-span-1 rounded-md bg-transparent cursor-pointer" className="p-0">
                            <div className="relative rounded-md overflow-hidden w-full h-full">
                              <Image src="/images/media-5.jpg" alt="Media 3" fill className="object-cover" />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                            </div>
                          </WobbleCard>
                        </MediaCarouselModal>
                        
                        <MediaCarouselModal mediaItems={mediaItems} initialIndex={3}>
                          <WobbleCard containerClassName="h-48 col-span-2 rounded-md bg-transparent cursor-pointer" className="p-0">
                            <div className="relative rounded-md overflow-hidden w-full h-full">
                              <Image src="/images/SilverHero1.png" alt="Card Image" fill className="object-cover" />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                            </div>
                          </WobbleCard>
                        </MediaCarouselModal>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Bio (mobile/tablet only to avoid duplication with desktop bio) */}
              <div className="space-y-3 lg:hidden">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bebas tracking-widest">Bio</h2>
                  <a href="#" className="text-[#FFBB00] hover:text-[#FFBB00]/80 text-sm underline">See All</a>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 leading-relaxed text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  This is a short bio section. Replace with player locker bio from Supabase later.
                </div>
              </div>
            </div>

            {/* Mobile view - tabs */}
            <div className="lg:hidden">
              <MobileTabs />
            </div>
          </section>
        </div>
      </main>
    );
  }

  // -------- LIVE (SUPABASE) PATH --------
  const supabase = await createClient();

  // Fetch player by slug
  const { data: player } = await supabase
    .from("players")
    .select("id, full_name, image_url, meta, city, banner_url")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!player) return notFound();

  // Locker (bio, colors, etc.)
  const { data: locker } = await supabase
    .from("player_lockers")
    .select("headline, bio, colors")
    .eq("player_id", player.id)
    .single();

  // Dynamic stats from player.meta
  const meta: any = (player as any).meta ?? {};
  const dobLive: string | undefined = meta.dob;
  const heightInLive: number | undefined = meta.height_in;
  const weightLbsLive: number | undefined = meta.weight_lbs;
  const gamesPlayedLive: number | undefined = meta.games_played;

  const ageLive = (() => {
    if (!dobLive) return undefined;
    const d = new Date(dobLive);
    if (isNaN(d.getTime())) return undefined;
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return a;
  })();

  const dobDisplayLive = (() => {
    if (!dobLive) return "—";
    const d = new Date(dobLive);
    if (isNaN(d.getTime())) return "—";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  })();

  const feetLive = Math.floor((heightInLive ?? 0) / 12);
  const inchesLive = (heightInLive ?? 0) % 12;

  // Videos
  const { data: vids } = await supabase
    .from("videos")
    .select("id,title,thumbnail_url")
    .eq("player_id", player.id)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(12);

  // Media (if you have a media table later; for now, you can reuse videos or images from Storage)
  const media: { id: string; title: string; url: string }[] = [];

  // Derive city from dedicated column or meta
  const city =
    (player as any).city ||
    (player.meta && (player.meta.hometown || player.meta.city || player.meta.location)) ||
    undefined;

  return (
    <main className="mx-auto max-w-6xl p-2 scrollbar-hide">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-6">
        {/* 1/4 column */}
        <aside className="space-y-2 lg:col-span-1 lg:sticky lg:top-2 lg:h-[calc(100vh-1rem)] lg:overflow-y-auto scrollbar-hide">
            <PlayerProfileCard
              fullName={player.full_name}
              city={city}
              bannerUrl={(player as any).banner_url}
              avatarUrl={player.image_url}
            />

        </aside>

        {/* 3/4 column */}
        <section className="space-y-2 lg:col-span-3 scrollbar-hide">
          {/* Image container above bio */}
          <div className="relative h-48 w-full rounded-t-md overflow-hidden hidden lg:block">
            <Image 
              src="/images/media-5.jpg" 
              alt="Player highlight" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
          </div>

          {/* Bio (desktop only, placed above Videos) */}
          <div className="space-y-3 hidden lg:block -mt-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bebas tracking-widest">Bio</h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 h-[150px] max-h-[150px] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="grid grid-cols-[1fr_1fr_2fr] gap-3 h-full">
                {/* Column 1: profile image */}
                <div className="rounded-md bg-black/20 border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full aspect-square max-w-[140px]">
                    <Image src="/images/Headshot.png" alt="Profile" fill className="object-cover rounded-md" />
                  </div>
                </div>

                {/* Column 2: stats grid */}
                <div className="flex flex-col gap-2 h-full justify-between">
                  <div className="rounded-md bg-black/20 border border-white/10 p-1 text-white/90 text-center flex items-center justify-center h-full">
                    <div className="text-[8px] opacity-80 inline ml-2 font-oswald">DOB: </div>
                     <div className="text-md font-bebas tracking-wider inline">{dobDisplayLive}{typeof ageLive === "number" && <span className="opacity-70 text-[8px] ml-1 font-oswald tracking-wider align-baseline">(age {ageLive})</span>}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                      <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Height</div>
                      <div className="text-sm font-bold font-bebas tracking-wider">{feetLive}'{inchesLive}</div>
                    </div>
                    <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                      <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Weight</div>
                      <div className="text-sm font-bold font-bebas tracking-wider">{(weightLbsLive ?? "—")} lbs</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                      <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Games Played</div>
                      <div className="text-base font-bold leading-[1.25rem] font-bebas tracking-wider">{(gamesPlayedLive ?? "—")}</div>
                    </div>
                    <div className="rounded-md bg-black/20 border border-white/10 p-1 text-center text-white/90">
                      <div className="text-[8px] uppercase tracking-wider opacity-70 font-oswald">Level</div>
                      <div className="text-base font-bold leading-[1.25rem] font-bebas tracking-wider">Professional</div>
                    </div>
                  </div>
                </div>

                {/* Column 3: biography with read more */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 rounded-md bg-black/20 border border-white/0 p-2 text-white/90 leading-relaxed overflow-hidden">
                    <p className="text-xs md:text-sm">
                      {locker?.bio ?? "Bio coming soon."}
                    </p>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <BioModal 
                      bioText={locker?.bio ?? "Bio coming soon."}
                      playerName={player.full_name}
                      playerLevel={(player as any).level || (player.meta as any)?.level || "Professional"}
                      playerStatus={(player as any).status || (player.meta as any)?.status || "active"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="space-y-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bebas tracking-widest">Videos</h2>
              <VideoGridModal playerName={player.full_name} videos={vids} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vids?.map((v: any) => (
                <VideoCard key={v.id} id={v.id} title={v.title} thumbnail_url={v.thumbnail_url ?? undefined} />
              ))}
              {!vids?.length && <div className="opacity-70">No videos yet.</div>}
            </div>
          </div>

          {/* Media */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bebas tracking-widest">Media</h2>
              <a href="#" className="text-[#FFBB00] hover:text-[#FFBB00]/80 text-sm underline px-4 uppercase">SEE ALL</a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {media.length === 0 && <div className="opacity-70">No media yet.</div>}
            </div>
          </div>

          {/* Bio (mobile/tablet only to avoid duplication with desktop bio) */}
          <div className="space-y-3 lg:hidden">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bebas tracking-widest">Bio</h2>
              <a href="#" className="text-[#FFBB00] hover:text-[#FFBB00]/80 text-sm underline">See All</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 leading-relaxed opacity-90">
              {locker?.bio ?? "Bio coming soon."}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
