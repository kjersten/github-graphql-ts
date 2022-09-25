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
  FaArrowsAltV,
  FaRegClock,
  FaBusinessTime,
} from "react-icons/fa";

import { Pull, TeamReviewRequest } from "../../../types";

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
          <Tooltip label="# of lines changed" layerStyle="tooltip">
            <Tag colorScheme="orange">
              <TagLeftIcon as={FaArrowsAltV} />
              <TagLabel>{pull.additions + pull.deletions}</TagLabel>
            </Tag>
          </Tooltip>
        )}
        <Tooltip label="hours to review" layerStyle="tooltip">
          <Tag colorScheme="gray">
            <TagLeftIcon as={FaRegClock} />
            <TagLabel>
              {teamReviewRequest.hoursToReview === -1
                ? "-"
                : teamReviewRequest.hoursToReview}
            </TagLabel>
          </Tag>
        </Tooltip>
        <Tooltip label="biz hours to review" layerStyle="tooltip">
          <Tag colorScheme="teal">
            <TagLeftIcon as={FaBusinessTime} />
            <TagLabel>
              {teamReviewRequest.bizHoursToReview === -1
                ? "-"
                : teamReviewRequest.bizHoursToReview}
            </TagLabel>
          </Tag>
        </Tooltip>
      </Wrap>
    </Flex>
  );
}

export default ReviewRequest;
