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

export const REVIEWS_QUERY = gql`
  query comments($searchQuery: String!) {
    search(query: $searchQuery, type: ISSUE, last: 100) {
      issueCount
      nodes {
        ... on PullRequest {
          __typename
          id
          url
          title
          author {
            __typename
            login
          }
          createdAt
          mergedAt
          additions
          deletions
          repository {
            __typename
            id
            name
          }
          reviewThreads(last: 20) {
            totalCount
            nodes {
              ... on PullRequestReviewThread {
                comments(last: 20) {
                  totalCount
                  nodes {
                    ... on PullRequestReviewComment {
                      __typename
                      id
                      author {
                        __typename
                        login
                      }
                    }
                  }
                }
              }
            }
          }
          readyForReview: timelineItems(
            first: 1
            itemTypes: READY_FOR_REVIEW_EVENT
          ) {
            nodes {
              ... on ReadyForReviewEvent {
                type: __typename
                id
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;
