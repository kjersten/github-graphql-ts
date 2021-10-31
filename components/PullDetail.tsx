import { useQuery, gql } from "@apollo/client";
import {
  Heading,
  Stack,
  Box,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Skeleton,
  SkeletonCircle,
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
  FaRegCheckCircle,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";
import { format, differenceInBusinessDays } from "date-fns";

import { Comments, Repository, Pull } from "./WeeklyPulls";

type Props = {
  pull: Pull;
};

function WeeklyPulls(props: Props) {
  const { pull } = props;
  const reviewRequestedAt =
    pull.timelineItems.items.length > 0
      ? pull.timelineItems.items[0].createdAt
      : pull.createdAt;
  const diffInBizDays = differenceInBusinessDays(
    new Date(pull.mergedAt),
    new Date(reviewRequestedAt)
  );

  // const dateFmt = "yyyy-MM-dd HH";
  // const fmtedMergedAt = format(new Date(pull.mergedAt), dateFmt);
  // const fmtedRequestedAt = format(new Date(reviewRequestedAt), dateFmt);

  // console.log(
  //   `merged ${fmtedMergedAt} - review requested ${fmtedRequestedAt} = ${diffInBizDays}`
  // );

  return (
    <Flex pl={2} paddingBottom={1}>
      <Box ml="3" maxWidth="600">
        <Text isTruncated>
          [{pull.repository.name}]{" "}
          <Link href={pull.url} color="blue.500" isExternal>
            {pull.title}
          </Link>
        </Text>
      </Box>
      <Spacer />
      <Wrap>
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
        <Tooltip label="biz days to merge">
          <Tag colorScheme="purple">
            <TagLeftIcon as={FaRegCheckCircle} />
            <TagLabel>{diffInBizDays}</TagLabel>
          </Tag>
        </Tooltip>
        {/* {pull.numComments > 0 && (
            <Tooltip label="# of comments">
              <Tag>
                <TagLeftIcon as={FaRegComments} />
                <TagLabel>{pull.numComments}</TagLabel>
              </Tag>
            </Tooltip>
          )}
          <Tooltip label="# of approvals">
            <Tag colorScheme={reviewColor}>
              <TagLeftIcon as={FaRegCheckCircle} />
              <TagLabel>{pull.reviews.totalCount} / 2</TagLabel>
            </Tag>
          </Tooltip> */}
      </Wrap>
    </Flex>
  );
}

export default WeeklyPulls;
