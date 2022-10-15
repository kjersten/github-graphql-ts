import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Table,
  TableContainer,
  Thead,
  Td,
  Th,
  Tr,
  Tbody,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

type Props = {
  stats: {
    total: number;
    totalNotReviewed: number;
    avgHoursToReview: number;
    avgBizHoursToReview: number;
    hoursToReview50: number;
    bizHoursToReview50: number;
    hoursToReview75: number;
    bizHoursToReview75: number;
    hoursToReview90: number;
    bizHoursToReview90: number;
  };
  prsForTimePeriod: number;
  prsFetched: number;
};

export default function ReviewRequestSummary(props: Props) {
  const {
    total,
    totalNotReviewed,
    avgHoursToReview,
    avgBizHoursToReview,
    hoursToReview50,
    bizHoursToReview50,
    hoursToReview75,
    bizHoursToReview75,
    hoursToReview90,
    bizHoursToReview90,
  } = props.stats;
  const { prsForTimePeriod, prsFetched } = props;
  const incompleteResults = prsFetched !== prsForTimePeriod;
  return (
    <Box paddingBottom={25}>
      {incompleteResults && (
        <Alert status="error" marginBottom={5}>
          <AlertIcon />
          <AlertTitle>Incomplete Result Set</AlertTitle>
          <AlertDescription>
            GitHub limits result sets to 1000 items but there are
            {" " + prsForTimePeriod} for this time period. Please select a
            shorter time period in order to see complete results.
          </AlertDescription>
        </Alert>
      )}
      <Heading as="h3" size="lg">
        Overall Stats
      </Heading>
      <StatGroup paddingBottom={25}>
        <Stat>
          <StatLabel>Requested</StatLabel>
          <StatNumber>{total}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Not Reviewed</StatLabel>
          <StatNumber>{totalNotReviewed}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Avg Total Hours</StatLabel>
          <StatNumber>{avgHoursToReview}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Avg Biz Hours to Review</StatLabel>
          <StatNumber>{avgBizHoursToReview}</StatNumber>
        </Stat>
      </StatGroup>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            Percentile Stats
            <AccordionIcon h={4} />
          </AccordionButton>
          <AccordionPanel>
            <TableContainer>
              <Table variant="simple" maxWidth={400}>
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>P50</Th>
                    <Th>P75</Th>
                    <Th>P90</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <b>Hours</b>
                    </Td>
                    <Td>{hoursToReview50}</Td>
                    <Td>{hoursToReview75}</Td>
                    <Td>{hoursToReview90}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <b>Business Hours</b>
                    </Td>
                    <Td>{bizHoursToReview50}</Td>
                    <Td>{bizHoursToReview75}</Td>
                    <Td>{bizHoursToReview90}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
