import { Center } from "@chakra-ui/react";
import type { ReactNode } from "react";


export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Center bg="blue.200" h="100vh">
            {children}
        </Center>
    );
}