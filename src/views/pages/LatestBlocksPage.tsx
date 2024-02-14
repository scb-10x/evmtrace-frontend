import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import { useSince } from "@/hooks/useSince";
import { ILatestBlock } from "@/interfaces/block";
import { formatHex } from "@/utils/string";
import {
  Box,
  HStack,
  Heading,
  Image,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import numbro from "numbro";
import { useMemo } from "react";

export const LatestBlocksPage = () => {
  const { blocks } = useLatest({
    initialBlocks: [],
  });

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ILatestBlock>();
    return [
      columnHelper.accessor("chain_id", {
        header: "Chain",
        cell: (row) => {
          const chainId = row.getValue();
          const chain = getChain(chainId);
          return (
            <HStack>
              <Image src={chain?.icon} boxSize={4} />
              <Text>{chain?.name}</Text>
            </HStack>
          );
        },
      }),
      columnHelper.accessor("number", {
        header: "Number",
      }),
      columnHelper.accessor("hash", {
        header: "Hash",
        cell: (row) => formatHex(row.getValue()),
      }),
      columnHelper.accessor("transaction_count", {
        header: "Txs",
      }),
      columnHelper.accessor("related_transaction_count", {
        header: "Related Txs",
      }),
      columnHelper.accessor("timestamp", {
        header: "Timestamp",
        cell: (row) => {
          const since = useSince(row.getValue() * 1000);
          return since;
        },
      }),
      columnHelper.accessor((r) => [r.gas_limit, r.gas_used] as const, {
        header: "Gas Used",
        cell: (row) => {
          const [gasLimit, gasUsed] = row.getValue();
          const pct = gasUsed / gasLimit;
          return (
            <Stack spacing={1}>
              <Text>
                {numbro(gasUsed).format({ thousandSeparated: true })} (
                {numbro(pct).format({
                  output: "percent",
                  mantissa: 2,
                  optionalMantissa: true,
                })}
                )
              </Text>
              <Box
                bg="whiteAlpha.400"
                h={0.5}
                w="full"
                rounded="full"
                position="relative"
                _after={{
                  content: '""',
                  position: "absolute",
                  h: "full",
                  w: `${pct * 100}%`,
                  bg: "primary.400",
                  rounded: "full",
                }}
              />
            </Stack>
          );
        },
      }),
    ];
  }, []);

  const table = useReactTable({
    data: blocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.hash,
  });

  return (
    <>
      <AppHeader title="Latest Blocks" />
      <Section>
        <Heading>Latest Blocks</Heading>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((h) => (
              <Tr key={h.id}>
                {h.headers.map((c) => (
                  <Th key={c.id} colSpan={c.colSpan}>
                    {c.isPlaceholder
                      ? null
                      : flexRender(c.column.columnDef.header, c.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            <AnimatePresence>
              {table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: i * 0.02,
                    duration: 0.5,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </Tbody>
        </Table>
      </Section>
    </>
  );
};
