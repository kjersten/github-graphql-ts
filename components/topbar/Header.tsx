import { signIn, signOut, useSession } from "next-auth/react";
import {
  Box,
  Flex,
  HStack,
  Spacer,
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { DarkModeSwitch } from "./DarkModeSwitch";

export default function Header() {
  const { data: session, status } = useSession();

  function renderSignInOrOut(
    authStatus: "authenticated" | "loading" | "unauthenticated",
    session: any
  ) {
    if (authStatus === "authenticated") {
      return (
        <>
          <Box>
            <Text as="strong">
              {session?.user?.email || session?.user?.name}
            </Text>
          </Box>
          <Box>
            <Button
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
              ml="2"
            >
              Sign out
            </Button>
          </Box>
        </>
      );
    }
    return (
      <Box>
        <Button
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          Sign in
        </Button>
      </Box>
    );
  }

  return (
    <Flex align="center" mt="2" mb="5">
      <Box>
        <Heading size="xl">GH Team View</Heading>
      </Box>
      <Spacer />
      <HStack>
        <FormControl>
          <FormLabel mb="0">Dark Mode</FormLabel>
          <DarkModeSwitch />
        </FormControl>
        {renderSignInOrOut(status, session)}
      </HStack>
    </Flex>
  );
}
