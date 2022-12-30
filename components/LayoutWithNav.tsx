import { Flex, Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import ClientOnly from "./ClientOnly";
import Navbar from "./nav/Navbar";

export default function LayoutWithNav(props: { children: React.ReactNode }) {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  return (
    <ClientOnly>
      <Flex>
        <Navbar />
        <Box w="100%">{props.children}</Box>
      </Flex>
    </ClientOnly>
  );
}
