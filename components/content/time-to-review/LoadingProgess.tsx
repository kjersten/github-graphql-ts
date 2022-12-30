import { Alert, Box, Spinner, Stack } from "@chakra-ui/react";

type Props = {
  currPrs: number;
  totalPrs: string;
};

export default function LoadingProgress(props: Props) {
  const { currPrs, totalPrs } = props;

  return (
    <Alert status="info">
      <Stack direction="row" spacing={4}>
        <Spinner speed="1.5s" />
        <Box>
          Loading PRs for this time period... {currPrs} of {totalPrs}
        </Box>
      </Stack>
    </Alert>
  );
}
