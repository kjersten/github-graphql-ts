import {
  Box,
  Text,
  Flex,
  Spacer,
  Link,
  Wrap,
  Tooltip,
  Tag,
  TagLeftIcon,
  TagLabel,
} from "@chakra-ui/react";
import {
  FaRegComments,
  FaCalendarCheck,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";

import { differenceInBusinessDays } from "date-fns";
import { Pull } from "../../types";

type Props = {
  pull: Pull;
};

function calcBizDaysToMerge(pull: Pull) {
  const reviewRequestedAt =
    pull.readyForReview.nodes.length > 0
      ? pull.readyForReview.nodes[0].createdAt
      : pull.createdAt;
  // const dateFmt = "yyyy-MM-dd HH";
  // const fmtedMergedAt = format(new Date(pull.mergedAt), dateFmt);
  // const fmtedRequestedAt = format(new Date(reviewRequestedAt), dateFmt);

  return differenceInBusinessDays(
    new Date(pull.mergedAt),
    new Date(reviewRequestedAt)
  );
}

export default function PullDetail(props: Props) {
  const { pull } = props;
  const bizDaysToMerge = calcBizDaysToMerge(pull);

  return (
    <Flex pl={2} paddingBottom={1}>
      <Box ml="3" maxWidth="550">
        <Text noOfLines={1}>
          [{pull.repository.name}]{" "}
          <Link href={pull.url} color="blue.500" isExternal>
            {pull.title}
          </Link>
        </Text>
      </Box>
      <Spacer />
      <Wrap>
        {pull.additions + pull.deletions > 250 && (
          <>
            <Tooltip label="# of lines added" layerStyle="tooltip">
              <Tag colorScheme="green">
                <TagLeftIcon as={FaPlusCircle} />
                <TagLabel>{pull.additions}</TagLabel>
              </Tag>
            </Tooltip>
            <Tooltip label="# of lines removed" layerStyle="tooltip">
              <Tag colorScheme="red">
                <TagLeftIcon as={FaMinusCircle} />
                <TagLabel>{pull.deletions}</TagLabel>
              </Tag>
            </Tooltip>
          </>
        )}
        {bizDaysToMerge > 2 && (
          <Tooltip label="biz days to merge" layerStyle="tooltip">
            <Tag colorScheme="purple">
              <TagLeftIcon as={FaCalendarCheck} />
              <TagLabel>{bizDaysToMerge}</TagLabel>
            </Tag>
          </Tooltip>
        )}
        {pull.reviewThreads && pull.reviewThreads.totalCount > 0 && (
          <Tooltip label="# of review threads" layerStyle="tooltip">
            <Tag>
              <TagLeftIcon as={FaRegComments} />
              <TagLabel>{pull.reviewThreads.totalCount}</TagLabel>
            </Tag>
          </Tooltip>
        )}
      </Wrap>
    </Flex>
  );
}
