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
  FaFire,
} from "react-icons/fa";

import {
  DateRange,
  Pull,
  TeamReviewRequest,
  ReviewRequestedEvent,
  PullRequestReview,
} from "../../types";

type Props = {
  teamReviewRequest: TeamReviewRequest;
  pull: Pull | undefined;
};

function ReviewRequest(props: Props) {
  const { teamReviewRequest, pull } = props;

  if (!pull) {
    return <p>Error: could not match a PR</p>;
  }

  return (
    <Flex pl={2} paddingBottom={1}>
      <Box maxWidth="550">
        <div key={pull.id + "-details"}>
          <Text noOfLines={1}>
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
        <Tooltip label="hours to review">
          <Tag colorScheme="blue">
            <TagLeftIcon as={FaRegClock} />
            {teamReviewRequest.hoursToReview === -1 ? (
              <TagRightIcon as={FaBan} />
            ) : (
              <TagLabel>{teamReviewRequest.hoursToReview}</TagLabel>
            )}
          </Tag>
        </Tooltip>
        <Tooltip label="biz hours to review">
          <Tag colorScheme="pink">
            {/* <TagLeftIcon as={FaFire} /> */}
            {teamReviewRequest.bizHoursToReview === -1 ? (
              <TagRightIcon as={FaBan} />
            ) : (
              <TagLabel>{teamReviewRequest.bizHoursToReview}</TagLabel>
            )}
          </Tag>
        </Tooltip>
      </Wrap>
    </Flex>
  );
}

export default ReviewRequest;
