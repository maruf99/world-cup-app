import { useQueryGames } from '@/util/queries';
import dynamic from 'next/dynamic';
import GameDisplay from '@/components/GameDisplay';
import Loading from '@/components/Loading';
import ErrorText from '@/components/ErrorText';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });


export default function GameDisplayPage() {
    // React hook that fetches /games API route. See util/queries.ts.
    const { isLoading, error, data } = useQueryGames();

    return (
        <Layout>
            {error ? <ErrorText /> : isLoading ? <Loading color="white"/> : <GameDisplay data={data}/>}
        </Layout>
    );
}