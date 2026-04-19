import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Users by subscription tier
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('tier, active');

    const activeSubscriptions = subData?.filter(s => s.active && s.tier !== 'free').length ?? 0;
    const freeUsers = subData?.filter(s => s.tier === 'free').length ?? 0;

    // New users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: newUsersMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Community posts count
    const { count: postsCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true });

    // Referrals count
    const { count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true });

    // Recent registrations (last 5)
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('email, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        totalUsers: totalUsers ?? 0,
        activeSubscriptions,
        freeUsers,
        newUsersMonth: newUsersMonth ?? 0,
        postsCount: postsCount ?? 0,
        referralCount: referralCount ?? 0,
        recentUsers: recentUsers ?? [],
      }),
    };
  } catch (error: any) {
    console.error('admin-get-analytics error:', error);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
}
