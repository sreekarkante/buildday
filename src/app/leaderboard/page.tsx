import { headers, cookies } from 'next/headers';
import LiveCounter from '@/components/LiveCounter';

export const dynamic = 'force-dynamic';

async function getLeaderboardData(sim: boolean, adminCookie: string | undefined) {
  // Rather than making an HTTP call to our own API which requires absolute URLs
  // and complex cookie passing, we will just call the API route handler directly.
  // We can pass a mock request to the GET handler.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let url = `${baseUrl}/api/leaderboard`;
  if (sim) url += '?sim=1';

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cookie': adminCookie ? `admin_session=${adminCookie}` : ''
      }
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    return { individuals: [], colleges: [], error: true };
  }
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sim = searchParams.sim === '1';
  const cookieStore = cookies();
  const adminCookie = cookieStore.get('admin_session')?.value;
  
  const data = await getLeaderboardData(sim, adminCookie);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <LiveCounter />

      <main className="container-main max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-center tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-cyan">
          Leaderboard
        </h1>

        <div className="space-y-12 mt-12">
          {/* Top Referrers */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-accent-cyan text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Top Referrers
            </h2>
            <div className="card p-0 overflow-hidden">
              {data.individuals?.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {data.individuals.map((ind: any, i: number) => (
                    <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 font-medium w-4">{i + 1}</span>
                        <span className="font-medium text-white">{ind.name}</span>
                      </div>
                      <div className="text-accent-cyan font-bold">{ind.referrals} referrals</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No referrers yet. Share your link to appear here!
                </div>
              )}
            </div>
          </section>

          {/* Campus Battle */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-accent-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Campus Battle
            </h2>
            <div className="card p-0 overflow-hidden">
              {data.colleges?.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {data.colleges.map((col: any, i: number) => (
                    <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 font-medium w-4">{i + 1}</span>
                        <span className="font-medium text-white line-clamp-1">{col.name}</span>
                      </div>
                      <div className="text-accent-blue font-bold whitespace-nowrap">{col.count} regs</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  Campus Battle starts when a college reaches 5 registrations.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
