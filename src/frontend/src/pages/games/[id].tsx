import Loading from "@/components/Loading";
import SeatDisplay from "@/components/SeatDisplay";
import { useQueryGames } from "@/util/queries";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

export default function GamePage() {
    const { isLoading, error, data } = useQueryGames();

    return (
        <Layout>
            {error ? <Heading size="4xl">An error occurred.</Heading> : isLoading ? <Loading color="white"/> : <SeatDisplay data={data}/>}
        </Layout>
    );
}