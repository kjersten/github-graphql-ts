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

import { Comments, Repository, Pull } from "./WeeklyPulls";

type Props = {
  pull: Pull;
};

function WeeklyPulls(props: Props) {
  const { pull } = props;

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
          <Tag colorScheme="cyan">
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
