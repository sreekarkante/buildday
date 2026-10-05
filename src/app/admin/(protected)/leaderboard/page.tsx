import { cookies } from 'next/headers';
import LeaderboardPage from '@/app/leaderboard/page';

export default function AdminLeaderboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const isSim = cookieStore.get('sim_mode')?.value === '1';
  
  return <LeaderboardPage searchParams={{ ...searchParams, sim: isSim ? '1' : '0' }} />;
}
