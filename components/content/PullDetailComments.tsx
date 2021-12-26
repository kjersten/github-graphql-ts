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

import { Pull } from "../../types";

type Props = {
  pull: Pull;
  reviewer: string | undefined;
};

function PullDetailComments(props: Props) {
  const { pull, reviewer } = props;
  let userCommentCount = 0;
  if (pull.reviewThreads.totalCount > 0) {
    const reviewThreads = pull.reviewThreads.nodes;
    reviewThreads.forEach((thread: any) => {
      // get the number of comments where the author is the reviewer
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
        <Text isTruncated>
          [{pull.repository.name}] <em>({pull.author.login})</em>{" "}
          <Link href={pull.url} color="blue.500" isExternal>
            {pull.title}
          </Link>
        </Text>
      </Box>
      <Spacer />
      <Wrap>
        {userCommentCount > 0 && (
          <Tooltip label="# comments by this user">
            <Tag>
              <TagLeftIcon as={FaUserPlus} />
              <TagLabel>{userCommentCount}</TagLabel>
            </Tag>
          </Tooltip>
        )}
        {pull.reviewThreads.totalCount > 0 && (
          <Tooltip label="# of review threads">
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

export default PullDetailComments;
