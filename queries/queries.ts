import { gql } from "@apollo/client";

export const TEAM_MEMBER_QUERY = gql`
  query teamMembers($org: String!, $team: String!) {
    organization(login: $org) {
      __typename
      id
      team(slug: $team) {
        __typename
        id
        members {
          nodes {
            id
            login
            name
          }
        }
      }
    }
  }
`;
