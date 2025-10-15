-- ============================================================================
-- BLTZ Revenue Sharing System - Example Data Setup
-- ============================================================================
-- This file provides examples for setting up player data for revenue sharing
--
-- REVENUE MODEL: 60% Player | 15% Team Pool | 15% Publisher | 10% Platform
-- ============================================================================

-- ============================================================================
-- 1. ADD SCHOOL AND YEARS DATA TO EXISTING PLAYERS
-- ============================================================================

-- Example: Update a player with school and years attended
UPDATE players 
SET 
  school = 'UCLA',
  meta = jsonb_set(
    jsonb_set(
      COALESCE(meta, '{}'::jsonb),
      '{years_start}',
      '2018'
    ),
    '{years_end}',
    '2022'
  )
WHERE id = 'your-player-uuid-here';

-- Example: Update multiple players from same school
-- Player 1: Daymeion Hughes (2003-2006 at Cal)
UPDATE players 
SET 
  school = 'University of California, Berkeley',
  meta = meta || '{"years_start": 2003, "years_end": 2006, "university": "Cal"}'::jsonb
WHERE slug = 'daymeion-hughes';

-- Player 2: Teammate from Cal (2004-2007)
UPDATE players 
SET 
  school = 'University of California, Berkeley',
  meta = meta || '{"years_start": 2004, "years_end": 2007, "university": "Cal"}'::jsonb
WHERE slug = 'teammate-name';


-- ============================================================================
-- 2. TAG PLAYERS IN VIDEOS FOR REVENUE SHARING
-- ============================================================================

-- Example: Tag 3 teammates in a video
INSERT INTO video_tags (video_id, tagged_player_id)
VALUES 
  ('video-uuid-1', 'player-uuid-1'),
  ('video-uuid-1', 'player-uuid-2'),
  ('video-uuid-1', 'player-uuid-3')
ON CONFLICT (video_id, tagged_player_id) DO NOTHING;


-- ============================================================================
-- 3. ADD SPONSOR REVENUE AND PUBLISHER INFO TO VIDEOS
-- ============================================================================

-- Example: Add sponsor amount to a video
UPDATE videos
SET meta = meta || '{"sponsor_amount": 500}'::jsonb
WHERE id = 'video-uuid-here';

-- Add publisher info to player (for revenue distribution)
UPDATE players
SET meta = meta || '{"league": "NFL", "publisher_type": "league"}'::jsonb
WHERE id = 'player-uuid-here';

-- For college players
UPDATE players
SET meta = meta || '{"publisher_type": "school"}'::jsonb
WHERE school IS NOT NULL;


-- ============================================================================
-- 4. QUERY EXAMPLES
-- ============================================================================

-- Get all videos with their tagged players
SELECT 
  v.id,
  v.title,
  v.player_id,
  p.full_name as owner_name,
  array_agg(tp.full_name) as tagged_teammates
FROM videos v
LEFT JOIN players p ON v.player_id = p.id
LEFT JOIN video_tags vt ON v.id = vt.video_id
LEFT JOIN players tp ON vt.tagged_player_id = tp.id
WHERE v.visibility = 'public'
GROUP BY v.id, v.title, v.player_id, p.full_name;

-- Get revenue distributions for a player
SELECT 
  rd.*,
  v.title as video_title,
  sp.full_name as source_player_name
FROM revenue_distributions rd
JOIN videos v ON rd.video_id = v.id
JOIN players sp ON rd.source_player_id = sp.id
WHERE rd.recipient_player_id = 'your-player-uuid'
ORDER BY rd.created_at DESC;

-- Get player earnings summary
SELECT 
  p.full_name,
  pe.total_earnings,
  pe.earnings_from_own_videos,
  pe.earnings_from_team_pool,
  pe.last_calculated_at
FROM player_earnings pe
JOIN players p ON pe.player_id = p.id
ORDER BY pe.total_earnings DESC;

-- Find teammates from same school with overlapping years
SELECT 
  p1.full_name as player_1,
  p1.school as school_1,
  (p1.meta->>'years_start')::int as years_start_1,
  (p1.meta->>'years_end')::int as years_end_1,
  p2.full_name as player_2,
  p2.school as school_2,
  (p2.meta->>'years_start')::int as years_start_2,
  (p2.meta->>'years_end')::int as years_end_2
FROM players p1
JOIN players p2 ON p1.school = p2.school AND p1.id != p2.id
WHERE 
  p1.school IS NOT NULL
  AND (p1.meta->>'years_start')::int IS NOT NULL
  AND (p2.meta->>'years_start')::int IS NOT NULL
  AND (p1.meta->>'years_start')::int <= (p2.meta->>'years_end')::int
  AND (p2.meta->>'years_start')::int <= (p1.meta->>'years_end')::int
ORDER BY p1.school, p1.full_name;


-- ============================================================================
-- 5. BULK UPDATE EXAMPLES
-- ============================================================================

-- Set years for all players at a specific school
UPDATE players
SET meta = meta || '{"years_start": 2015, "years_end": 2019}'::jsonb
WHERE school = 'UCLA' AND (meta->>'years_start') IS NULL;

-- Add default school to players based on team name
UPDATE players
SET school = 'University of Southern California'
WHERE team LIKE '%USC%' AND school IS NULL;


-- ============================================================================
-- 6. REVENUE CALCULATION TRIGGER (Optional - for automatic calculation)
-- ============================================================================

-- Create a function to auto-calculate revenue when views are added
CREATE OR REPLACE FUNCTION trigger_revenue_calculation()
RETURNS TRIGGER AS $$
BEGIN
  -- You could trigger revenue calculation here
  -- For now, we'll do it manually via API calls
  -- This is just a placeholder for future automation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create trigger on views table
-- CREATE TRIGGER on_view_added
--   AFTER INSERT ON views
--   FOR EACH ROW
--   EXECUTE FUNCTION trigger_revenue_calculation();


-- ============================================================================
-- 7. ADMIN ANALYTICS QUERIES
-- ============================================================================

-- Total BLTZ Platform Revenue (10%)
SELECT 
  SUM(amount) as total_bltz_revenue,
  COUNT(DISTINCT video_id) as videos_processed
FROM platform_revenue;

-- Publisher Revenue Breakdown (15% per video)
SELECT 
  publisher_name,
  publisher_type,
  SUM(amount) as total_revenue,
  COUNT(DISTINCT video_id) as videos,
  COUNT(DISTINCT player_id) as players
FROM publisher_revenue
GROUP BY publisher_name, publisher_type
ORDER BY total_revenue DESC;

-- Complete Revenue Breakdown (All 4 Categories)
SELECT 
  'Player Direct (60%)' as category,
  SUM(amount) as total_revenue
FROM revenue_distributions
WHERE distribution_type = 'view_revenue'
UNION ALL
SELECT 
  'Team Pool (15%)' as category,
  SUM(amount) as total_revenue
FROM revenue_distributions
WHERE distribution_type = 'team_pool'
UNION ALL
SELECT 
  'Publishers (15%)' as category,
  SUM(amount) as total_revenue
FROM publisher_revenue
UNION ALL
SELECT 
  'BLTZ Platform (10%)' as category,
  SUM(amount) as total_revenue
FROM platform_revenue;

-- ============================================================================
-- 8. ANALYTICS VIEWS
-- ============================================================================

-- Create a view for easy revenue analytics
CREATE OR REPLACE VIEW player_revenue_summary AS
SELECT 
  p.id as player_id,
  p.full_name,
  p.school,
  pe.total_earnings,
  pe.earnings_from_own_videos,
  pe.earnings_from_team_pool,
  COALESCE(video_count.count, 0) as total_videos,
  COALESCE(view_count.count, 0) as total_views,
  COALESCE(tagged_count.count, 0) as times_tagged_in_videos,
  pe.last_calculated_at
FROM players p
LEFT JOIN player_earnings pe ON p.id = pe.player_id
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM videos 
  WHERE player_id = p.id AND visibility = 'public'
) video_count ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM views 
  WHERE player_id = p.id
) view_count ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM video_tags 
  WHERE tagged_player_id = p.id
) tagged_count ON true
ORDER BY pe.total_earnings DESC NULLS LAST;

-- Create a view for video revenue breakdown
CREATE OR REPLACE VIEW video_revenue_breakdown AS
SELECT 
  v.id as video_id,
  v.title,
  v.player_id,
  p.full_name as owner_name,
  COALESCE(view_count.count, 0) as views,
  COALESCE(view_count.count, 0) * 0.05 as view_revenue,
  COALESCE((v.meta->>'sponsor_amount')::decimal, 0) as sponsor_revenue,
  (COALESCE(view_count.count, 0) * 0.05 + COALESCE((v.meta->>'sponsor_amount')::decimal, 0)) as total_revenue,
  COALESCE(tagged_count.count, 0) as tagged_players_count,
  v.created_at
FROM videos v
JOIN players p ON v.player_id = p.id
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM views 
  WHERE video_id = v.id
) view_count ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM video_tags 
  WHERE video_id = v.id
) tagged_count ON true
WHERE v.visibility = 'public'
ORDER BY total_revenue DESC;


-- ============================================================================
-- 8. USEFUL QUERIES FOR MONITORING
-- ============================================================================

-- Top earners from team pool
SELECT 
  p.full_name,
  p.school,
  pe.earnings_from_team_pool,
  COUNT(DISTINCT vt.video_id) as videos_tagged_in
FROM player_earnings pe
JOIN players p ON pe.player_id = p.id
LEFT JOIN video_tags vt ON p.id = vt.tagged_player_id
WHERE pe.earnings_from_team_pool > 0
GROUP BY p.id, p.full_name, p.school, pe.earnings_from_team_pool
ORDER BY pe.earnings_from_team_pool DESC
LIMIT 20;

-- Videos with highest team pool distributions
SELECT 
  v.title,
  p.full_name as owner,
  COUNT(vt.tagged_player_id) as tagged_players,
  SUM(rd.amount) as total_team_pool_distributed
FROM videos v
JOIN players p ON v.player_id = p.id
LEFT JOIN video_tags vt ON v.id = vt.video_id
LEFT JOIN revenue_distributions rd ON v.id = rd.video_id AND rd.distribution_type = 'team_pool'
GROUP BY v.id, v.title, p.full_name
HAVING COUNT(vt.tagged_player_id) > 0
ORDER BY total_team_pool_distributed DESC
LIMIT 20;

-- School-based revenue summary
SELECT 
  p.school,
  COUNT(DISTINCT p.id) as total_players,
  SUM(pe.total_earnings) as total_school_earnings,
  AVG(pe.total_earnings) as avg_per_player
FROM players p
LEFT JOIN player_earnings pe ON p.id = pe.player_id
WHERE p.school IS NOT NULL
GROUP BY p.school
ORDER BY total_school_earnings DESC;


-- ============================================================================
-- 10. ADMIN DASHBOARD QUERIES
-- ============================================================================

-- Daily Revenue Summary (for admin dashboard)
SELECT 
  summary_date,
  total_platform_revenue as bltz_revenue,
  total_publisher_revenue as publisher_revenue,
  total_player_revenue as player_revenue,
  total_team_pool_revenue as team_pool_revenue,
  (total_platform_revenue + total_publisher_revenue + 
   total_player_revenue + total_team_pool_revenue) as grand_total
FROM admin_revenue_summary
ORDER BY summary_date DESC
LIMIT 30;

-- Platform Revenue Trends (Monthly)
SELECT 
  DATE_TRUNC('month', calculation_date) as month,
  SUM(amount) as monthly_platform_revenue,
  COUNT(DISTINCT video_id) as videos_generating_revenue
FROM platform_revenue
GROUP BY month
ORDER BY month DESC;

-- Top Revenue-Generating Schools
SELECT 
  pr.publisher_name as school,
  SUM(pr.amount) as school_receives,
  SUM(COALESCE(rd_owner.amount, 0)) as players_receive,
  SUM(COALESCE(rd_team.amount, 0)) as team_pool_distributed,
  COUNT(DISTINCT pr.video_id) as total_videos
FROM publisher_revenue pr
LEFT JOIN revenue_distributions rd_owner ON pr.video_id = rd_owner.video_id 
  AND rd_owner.distribution_type = 'view_revenue'
LEFT JOIN revenue_distributions rd_team ON pr.video_id = rd_team.video_id 
  AND rd_team.distribution_type = 'team_pool'
WHERE pr.publisher_type = 'school'
GROUP BY pr.publisher_name
ORDER BY school_receives DESC
LIMIT 20;

-- Revenue Flow Sanity Check (Should sum to 100% per video)
SELECT 
  v.id as video_id,
  v.title,
  COALESCE(views.view_count, 0) as views,
  COALESCE(views.view_count, 0) * 0.05 as estimated_view_revenue,
  COALESCE((v.meta->>'sponsor_amount')::decimal, 0) as sponsor_revenue,
  COALESCE(player_rev.amount, 0) as player_received_60,
  COALESCE(team_pool.total, 0) as team_pool_15,
  COALESCE(pub.amount, 0) as publisher_15,
  COALESCE(plat.amount, 0) as platform_10,
  (COALESCE(player_rev.amount, 0) + COALESCE(team_pool.total, 0) + 
   COALESCE(pub.amount, 0) + COALESCE(plat.amount, 0)) as total_distributed
FROM videos v
LEFT JOIN LATERAL (
  SELECT COUNT(*) as view_count FROM views WHERE video_id = v.id
) views ON true
LEFT JOIN LATERAL (
  SELECT SUM(amount) as amount 
  FROM revenue_distributions 
  WHERE video_id = v.id AND distribution_type = 'view_revenue'
) player_rev ON true
LEFT JOIN LATERAL (
  SELECT SUM(amount) as total 
  FROM revenue_distributions 
  WHERE video_id = v.id AND distribution_type = 'team_pool'
) team_pool ON true
LEFT JOIN LATERAL (
  SELECT amount FROM publisher_revenue WHERE video_id = v.id LIMIT 1
) pub ON true
LEFT JOIN LATERAL (
  SELECT amount FROM platform_revenue WHERE video_id = v.id LIMIT 1
) plat ON true
WHERE v.visibility = 'public'
ORDER BY total_distributed DESC
LIMIT 20;

