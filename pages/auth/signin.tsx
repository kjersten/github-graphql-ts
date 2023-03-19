import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
} from "@chakra-ui/react";

import Layout from "../../components/Layout";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") {
    router.push("/");
  }
  let { error } = router.query;

  return (
    <Layout>
      {error && (
        <Alert status="error" mb={5} maxWidth={700}>
          <AlertIcon />
          <AlertTitle>OAuth Login Error</AlertTitle>
          <AlertDescription>
            There was an error signing into your account. Please try again.
          </AlertDescription>
        </Alert>
      )}
      <Box>
        Sign in to get a team-level overview of pull requests, reviews and time
        to review.
      </Box>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button mt={5} colorScheme="blue" onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        </div>
      ))}
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
