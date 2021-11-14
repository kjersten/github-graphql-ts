import { signIn, signOut, useSession } from "next-auth/client";
import {
  Box,
  Flex,
  HStack,
  Spacer,
  Button,
  Avatar,
  Heading,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { DarkModeSwitch } from "./DarkModeSwitch";

export default function Header() {
  const [session] = useSession();
  return (
    <Flex align="center" mt="1" mb="5">
      <Box>
        <Heading size="xl">GH Team View</Heading>
      </Box>
      <Spacer />
      <HStack>
        <FormControl>
          <FormLabel mb="0">Dark Mode</FormLabel>
          <DarkModeSwitch />
        </FormControl>
        {!session && (
          <Box>
            <Button
              href={`/api/auth/signin`}
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Sign in
            </Button>
          </Box>
        )}
        {session && (
          <>
            <Box>
              {/* <Avatar name={session.user.name} src={session.user.image} /> */}
            </Box>
            <Box>
              Kjersten Elias
              {/* <Text as="strong">{session.user.email || session.user.name}</Text> */}
            </Box>
            <Box>
              <Button
                href={`/api/auth/signout`}
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
        )}
      </HStack>
    </Flex>
  );
}
