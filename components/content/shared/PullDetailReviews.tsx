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
import { FaRegComments, FaUserPlus } from "react-icons/fa";

import { Pull } from "../../../types";

type Props = {
  pull: Pull;
  reviewer: string | undefined;
};

export default function PullDetailReviews(props: Props) {
  const { pull, reviewer } = props;
  let userCommentCount = 0;
  if (
    pull.reviewThreads &&
    pull.reviewThreads.totalCount > 0 &&
    pull.reviewThreads.nodes !== null
  ) {
    const threads = pull.reviewThreads.nodes;
    threads.forEach((thread: any) => {
      // get the number of comments this eng left on any of the threads
      if (thread.comments.totalCount > 0) {
        const comments = thread.comments.nodes;
        comments.forEach((comment: any) => {
          if (comment.author.login === reviewer) {
            userCommentCount++;
          }
        });
      }
    });
  }

  return (
    <Flex pl={2} paddingBottom={1}>
      <Box ml="3" maxWidth="650">
        <Text noOfLines={1}>
          [{pull.repository.name}] <em>({pull.author.login})</em>{" "}
          <Link href={pull.url} color="blue.500" isExternal>
            {pull.title}
          </Link>
        </Text>
      </Box>
      <Spacer />
      <Wrap>
        {userCommentCount > 0 && (
          <Tooltip label="# comments by this user" layerStyle="tooltip">
            <Tag>
              <TagLeftIcon as={FaUserPlus} />
              <TagLabel>{userCommentCount}</TagLabel>
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
