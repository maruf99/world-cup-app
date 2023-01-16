import { type GameData, getCountryFlag } from '@/util/util';
import { Box, Grid, Heading, HStack, Image, Link, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

function GameList({ list }: { list: GameData['games'] }) {
	return (
		<Grid templateColumns={`repeat(${useBreakpointValue({ base: 2, md: 3 })}, 1fr)`} gap={6}>
			{list.map((game) => {
				return (
					<NextLink key={game.id} href={`/games/${game.id}`}>
						<Link>
							<Box
								as="button"
								width="250px"
								p={2}
								bgColor="blue.400"
								transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
								_hover={{ bgColor: 'blue.300' }}
								rounded="lg"
							>
								<Text fontSize="md" fontWeight="bold">
									{game.city}, {game.state}
								</Text>
								<Text fontSize="sm">{game.venue}</Text>
							</Box>
						</Link>
					</NextLink>
				);
			})}
		</Grid>
	);
}

export default function GameDisplay({ data }: { data: GameData[] }) {
	return (
		<VStack spacing={16}>
			<VStack spacing={10}>
				<Heading size="md">Select a city.</Heading>
			</VStack>
			<VStack spacing={8}>
				{data.map((country) => {
					return (
						<VStack key={country.name} spacing={6}>
							<HStack>
								<Image width={10} src={getCountryFlag(country.name)} />
								<Heading size="md">{country.name}</Heading>
							</HStack>
							<GameList list={country.games} />
						</VStack>
					);
				})}
			</VStack>
		</VStack>
	);
}
