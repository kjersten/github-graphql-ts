import React, { ReactNode } from "react";
import Head from "next/head";
import { Container } from "@chakra-ui/react";

import Header from "../components/topbar/Header";

type Props = {
  children?: ReactNode;
};

export default function Layout(props: Props) {
  const { children } = props;
  return (
    <div>
      <Head>
        <title>GH Team View</title>
        <meta name="description" content="View Your Team's Activity" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
        <meta
          name="google-site-verification"
          content="uNBFx20dKT8iXB1sIi4jLufzmHFEe-2_rmep8WS7aig"
        />
      </Head>

      <header>
        <Container maxW="container.xl">
          <Header />
        </Container>
      </header>
      <main>
        <Container maxW="container.xl">{children}</Container>
      </main>
    </div>
  );
}
