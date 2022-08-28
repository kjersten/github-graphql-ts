import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Flex,
  Link,
  Spacer,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Wrap,
  TagRightIcon,
} from "@chakra-ui/react";
import {
  FaBan,
  FaRegComments,
  FaCalendarCheck,
  FaMinusCircle,
  FaPlusCircle,
  FaRegClock,
} from "react-icons/fa";
import { differenceInBusinessDays } from "date-fns";

import { DateRange, Pull, PullWithReviewStats } from "../../types";
import { diffInHours } from "../../utilities/date_utils";

type Props = {
  org: string | undefined;
  teamFullName: string | undefined;
  week: DateRange;
};

const QUERY = gql`
  query reviewRequests($searchQuery: String!) {
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

function addTimeToReview(pull: Pull, team: string): PullWithReviewStats {
  if (!pull.reviews || !pull.reviewRequestedEvents) {
    return {
      ...pull,
      readyAt: pull.createdAt,
      reviewedAt: null,
      hoursToReview: -1,
      bizDaysToMerge: -1,
    };
  }
  const firstRequest = pull.reviewRequestedEvents.nodes.find(
    (request) => request.requestedReviewer.combinedSlug === team
  );
  const readyAt = firstRequest?.createdAt || pull.createdAt;
  const firstReview = pull.reviews.nodes.find(
    (review) => review.onBehalfOf.nodes[0]?.combinedSlug === team
  );
  const reviewedAt = firstReview?.createdAt || null;
  const hoursToReview = diffInHours(reviewedAt, readyAt);
  const bizDaysToMerge = differenceInBusinessDays(
    new Date(pull.mergedAt),
    new Date(readyAt)
  );
  return {
    ...pull,
    reviewedAt,
    readyAt,
    hoursToReview,
    bizDaysToMerge,
  };
}

function ReviewRequestsByWeek(props: Props) {
  const { org, teamFullName, week } = props;
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      searchQuery: `org:${org} is:pr created:${week.startString}..${week.endString}`,
      pollInterval: 0,
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const numPrs = data.search.issueCount;
  const prsFromQuery: Pull[] = data.search.nodes;
  const prs: PullWithReviewStats[] = prsFromQuery.map((pr: Pull) =>
    addTimeToReview(pr, teamFullName || "")
  );
  console.log(new Date().toUTCString());
  console.log(prs);

  return (
    <Box>
      {week.startString} - {week.endString}{" "}
      <em>({numPrs} reviews requested)</em>
      {prs.map((pull: PullWithReviewStats) => (
        <Flex pl={2} paddingBottom={1} key={pull.id + "-review-request"}>
          <Box>
            <div key={pull.id + "-details"}>
              <Text isTruncated>
                [{pull.repository.name}] ({pull.author.login}){" "}
                <Link href={pull.url} color="blue.500" isExternal>
                  {pull.title}
                </Link>
              </Text>
            </div>
          </Box>
          <Spacer />
          <Wrap>
            {pull.additions + pull.deletions > 250 && (
              <>
                <Tooltip label="# of lines added">
                  <Tag colorScheme="green">
                    <TagLeftIcon as={FaPlusCircle} />
                    <TagLabel>{pull.additions}</TagLabel>
                  </Tag>
                </Tooltip>
                <Tooltip label="# of lines removed">
                  <Tag colorScheme="red">
                    <TagLeftIcon as={FaMinusCircle} />
                    <TagLabel>{pull.deletions}</TagLabel>
                  </Tag>
                </Tooltip>
              </>
            )}
            {pull.bizDaysToMerge > 2 && (
              <Tooltip label="biz days to merge">
                <Tag colorScheme="purple">
                  <TagLeftIcon as={FaCalendarCheck} />
                  <TagLabel>{pull.bizDaysToMerge}</TagLabel>
                </Tag>
              </Tooltip>
            )}
            {pull.reviewThreads && pull.reviewThreads.totalCount > 0 && (
              <Tooltip label="# of review threads">
                <Tag>
                  <TagLeftIcon as={FaRegComments} />
                  <TagLabel>{pull.reviewThreads.totalCount}</TagLabel>
                </Tag>
              </Tooltip>
            )}
            <Tooltip label="hours to review">
              <Tag colorScheme="blue">
                <TagLeftIcon as={FaRegClock} />
                {pull.hoursToReview == -1 ? (
                  <TagRightIcon as={FaBan} />
                ) : (
                  <TagLabel>{pull.hoursToReview}</TagLabel>
                )}
              </Tag>
            </Tooltip>
          </Wrap>
        </Flex>
      ))}
    </Box>
  );
}

export default ReviewRequestsByWeek;
