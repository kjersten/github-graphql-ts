import { gql } from "@apollo/client";

export const ORGANIZATIONS_QUERY = gql`
  query Organizations {
    viewer {
      login
      organizations(first: 50) {
        nodes {
          __typename
          id
          name
          login
        }
      }
    }
  }
`;

export const TEAM_QUERY = gql`
  query Teams($org: String!) {
    organization(login: $org) {
      __typename
      id
      name
      login
      teams(first: 50) {
        nodes {
          __typename
          id
          name
          slug
          combinedSlug
        }
      }
    }
  }
`;

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

export const REVIEWS_FOR_PULLS_WITHIN_DATES_QUERY = gql`
  query allPrsForTimerange($searchQuery: String!, $after: String) {
    search(query: $searchQuery, type: ISSUE, first: 45, after: $after) {
      issueCount
      pageInfo {
        endCursor
        hasNextPage
      }
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
          reviewRequestedEvents: timelineItems(
            first: 10
            itemTypes: REVIEW_REQUESTED_EVENT
          ) {
            nodes {
              ... on ReviewRequestedEvent {
                __typename
                id
                createdAt
                requestedReviewer {
                  ... on Team {
                    __typename
                    id
                    slug
                    combinedSlug
                  }
                }
              }
            }
          }
          reviews(first: 10) {
            nodes {
              ... on PullRequestReview {
                __typename
                id
                createdAt
                author {
                  login
                }
                onBehalfOf(first: 1) {
                  nodes {
                    __typename
                    id
                    name
                    slug
                    combinedSlug
                  }
                }
              }
            }
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

export const PULLS_BY_AUTHOR_QUERY = gql`
  query PRs($searchQuery: String!) {
    search(query: $searchQuery, type: ISSUE, last: 100) {
      issueCount
      nodes {
        ... on PullRequest {
          __typename
          id
          url
          title
          author {
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
          reviewThreads(first: 1) {
            totalCount
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
