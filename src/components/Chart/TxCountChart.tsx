import { ITxCountStats } from "@/interfaces/stats";
import {
  Box,
  Circle,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useToken,
} from "@chakra-ui/react";
import moment from "moment";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import tinycolor from "tinycolor2";

interface IPivotedData {
  timestamp: number;
  relatedTransactionCount: number;
  allTransactionCount: number;
  [chainId: number]: {
    relatedTransactionCount: number;
    allTransactionCount: number;
  };
}

export const TxCountChart = ({ stats }: { stats: ITxCountStats[] }) => {
  const data = useMemo(() => {
    const pivotedData: IPivotedData[] = [];
    const reversedStats = stats.slice().reverse();
    let latestTimestamp = 0;
    for (const stat of reversedStats) {
      const { timestamp, chainId, transactionCount, totalTransactionCount } =
        stat;
      // timestamp a chainId 1 transactionCount x1 totalTransactionCount y1
      // timestamp a chainId 2 transactionCount x2 totalTransactionCount y2
      // timestamp b chainId 1 transactionCount x3 totalTransactionCount y3
      // timestamp b chainId 2 transactionCount x4 totalTransactionCount y4
      // to
      // timestamp a relatedTransactionCount x1+x2 allTransactionCount y1+y2 { chainId1: { relatedTransactionCount: x1, allTransactionCount: y1 }, chainId2: { relatedTransactionCount: x2, allTransactionCount: y2 } }

      const pivotedIndex =
        timestamp === latestTimestamp ? pivotedData.length - 1 : null;
      if (pivotedIndex === null) {
        pivotedData.push({
          timestamp,
          relatedTransactionCount: transactionCount,
          allTransactionCount: totalTransactionCount,
          [chainId]: {
            relatedTransactionCount: transactionCount,
            allTransactionCount: totalTransactionCount,
          },
        });
        latestTimestamp = timestamp;
      } else {
        pivotedData[pivotedIndex].relatedTransactionCount += transactionCount;
        pivotedData[pivotedIndex].allTransactionCount += totalTransactionCount;
        pivotedData[pivotedIndex][chainId] = {
          relatedTransactionCount: transactionCount,
          allTransactionCount: totalTransactionCount,
        };
      }
    }

    return pivotedData;
  }, [stats]);

  const ticks = useBreakpointValue([100, 50, 25]);

  const [color] = useToken("colors", ["primary.400"]);
  const lightColor = tinycolor(color).lighten().setAlpha(0.9).toString();

  return (
    <>
      <Stack>
        <HStack fontSize={["sm", "md"]}>
          <Circle size={2} bg={lightColor} />
          <Text>All Transactions</Text>
          <Circle size={2} bg={color} />
          <Text>Related Transactions</Text>
        </HStack>
        <Box h="230px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis fontSize="12px" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(v) => moment(v * 1000).format("MMM D, hh:mm")}
                interval={ticks}
                fontSize="12px"
              />
              <CartesianGrid strokeDasharray="10 10" opacity={0.15} />
              <Line
                type="monotone"
                dataKey="allTransactionCount"
                stroke={lightColor}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="relatedTransactionCount"
                stroke={color}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    </>
  );
};
