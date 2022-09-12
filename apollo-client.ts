import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from the session
  const session = await getSession();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: ["query", "type"],
          merge(existing = makeEmptyData(), incoming, { readField }) {
            const incomingNodes = incoming.nodes.slice(0);
            const existingNodes = existing.nodes.slice(0);
            const nodes = [...incomingNodes, ...existingNodes];
            return {
              pageInfo: incoming.pageInfo,
              issueCount: incoming.issueCount,
              nodes,
            };
          },

          read(existing) {
            if (!existing) return;
            return {
              pageInfo: existing.pageInfo,
              issueCount: existing.issueCount,
              nodes: existing.nodes,
            };
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});

function makeEmptyData() {
  return {
    issueCount: 0,
    pageInfo: {
      hasNextPage: true,
      endCursor: "",
    },
    nodes: [],
  };
}

export default client;
