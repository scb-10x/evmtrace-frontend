import { chains } from "@/constants/web3";
import { ITxCountStats } from "@/interfaces/stats";
import theme from "@/themes";
import {
  Box,
  Card,
  Checkbox,
  Circle,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  useBreakpointValue,
} from "@chakra-ui/react";
import _ from "lodash";
import moment from "moment";
import numbro from "numbro";
import { useMemo, useState } from "react";
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

  const ticks = useBreakpointValue([100, 40, 20]);
  const yWidth = useBreakpointValue([30, 50]);

  const total = {
    id: 0,
    color: theme["colors"]["primary"]["400"],
    lightColor: theme["colors"]["primary"]["100"],
    name: "",
    icon: undefined,
  };
  const [selected, setSelected] = useState<
    { key: string; color: string; label: string }[]
  >([
    {
      key: "allTransactionCount",
      color: theme["colors"]["primary"]["100"],
      label: "All Txs",
    },
    {
      key: "relatedTransactionCount",
      color: theme["colors"]["primary"]["400"],
      label: "Related Txs",
    },
  ]);

  return (
    <>
      <Stack direction={["column", "row"]}>
        <SimpleGrid columns={[1, 1]} spacingX={2}>
          <Table
            size="sm"
            sx={{
              th: {
                position: "relative",
                fontSize: "xs",
              },
              "th, td": {
                whiteSpace: "nowrap",
                pl: 1,
                pr: 1,
              },
            }}
          >
            <Thead>
              <Tr>
                <Th>
                  <Text className="rt">All</Text>
                </Th>
                <Th>
                  <Text className="rt">Related</Text>
                </Th>
                <Th>Chain</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[total, ...chains].map((c) => {
                const color = c.color;
                const lightColor =
                  (c as any)?.lightColor ||
                  tinycolor(color).saturate(20).lighten(20).toString();
                const key = c.id ? `${c.id}.` : "";
                return (
                  <Tr key={c.id}>
                    <Td>
                      <Checkbox
                        colorScheme="primary"
                        isChecked={
                          !!selected.find(
                            (e) => e.key === `${key}allTransactionCount`
                          )
                        }
                        onChange={(changed) => {
                          if (changed.target.checked) {
                            setSelected((prev) => [
                              ...prev,
                              {
                                key: `${key}allTransactionCount`,
                                color: lightColor,
                                label: c.name ? `${c.name} All Txs` : "All Txs",
                              },
                            ]);
                          } else {
                            setSelected((prev) =>
                              prev.filter(
                                (e) => e.key !== `${key}allTransactionCount`
                              )
                            );
                          }
                        }}
                      />
                    </Td>
                    <Td>
                      <Checkbox
                        colorScheme="primary"
                        isChecked={
                          !!selected.find(
                            (e) => e.key === `${key}relatedTransactionCount`
                          )
                        }
                        onChange={(changed) => {
                          if (changed.target.checked) {
                            setSelected((prev) => [
                              ...prev,
                              {
                                key: `${key}relatedTransactionCount`,
                                color,
                                label: c.name
                                  ? `${c.name} Related Txs`
                                  : "Related Txs",
                              },
                            ]);
                          } else {
                            setSelected((prev) =>
                              prev.filter(
                                (e) => e.key !== `${key}relatedTransactionCount`
                              )
                            );
                          }
                        }}
                      />
                    </Td>
                    <Td>
                      {c.icon ? (
                        <Image src={c.icon} boxSize={4} />
                      ) : (
                        <Text>All</Text>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </SimpleGrid>
        <Stack w="100%">
          <Wrap fontSize={["sm", "md"]} spacingX={2} spacingY={0}>
            {selected.map((c) => (
              <HStack key={c.key}>
                <Circle size={2} bg={c.color} />
                <Text>{c.label}</Text>
              </HStack>
            ))}
          </Wrap>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <YAxis
                  fontSize="12px"
                  width={yWidth}
                  tickFormatter={(v) => numbro(v).format({ average: true })}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(v) => moment(v * 1000).format("D/M, hh:mm")}
                  interval={ticks}
                  fontSize="12px"
                  height={20}
                />
                <CartesianGrid strokeDasharray="10 10" opacity={0.15} />
                <Tooltip
                  content={(e) => {
                    const { payload, label } = e;
                    return (
                      <Stack spacing={0} p={1} as={Card}>
                        <Text>{moment(label * 1000).format("D/M, hh:mm")}</Text>
                        <SimpleGrid columns={2} spacingX={2}>
                          {payload?.map((p) => (
                            <HStack key={p.dataKey}>
                              <Circle bg={p.color} size={2} />
                              <Text>
                                {numbro(p.value).format({
                                  thousandSeparated: true,
                                })}
                              </Text>
                            </HStack>
                          ))}
                        </SimpleGrid>
                      </Stack>
                    );
                  }}
                />
                {selected.map((c) => (
                  <Line
                    key={c.key}
                    type="monotone"
                    dataKey={c.key}
                    stroke={c.color}
                    dot={false}
                    activeDot={{
                      strokeWidth: 0,
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};
