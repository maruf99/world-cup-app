import { useQueryGames } from '@/util/queries';
import dynamic from 'next/dynamic';
import GameDisplay from '@/components/GameDisplay';
import Loading from '@/components/Loading';
import { Heading } from '@chakra-ui/react';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });


export default function GameDisplayPage() {
    const { isLoading, error, data } = useQueryGames();

    return (
        <Layout>
            {error ? <Heading size="4xl">An error occurred.</Heading> : isLoading ? <Loading color="white"/> : <GameDisplay data={data}/>}
        </Layout>
    );
}