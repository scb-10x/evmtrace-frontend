import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import { ILatestTransaction } from "@/interfaces/transaction";
import { Badge, HStack, Heading, Image, Stack, Text } from "@chakra-ui/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { AnimatedTable } from "../layouts/AnimatedTable";
import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { formatEther } from "viem";
import { useSince } from "@/hooks/useSince";
import numbro from "numbro";

export const LatestTransactionPage = () => {
  const { txs } = useLatest({
    initialTxs: [],
  });

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ILatestTransaction>();
    return [
      columnHelper.accessor("chain_id", {
        header: "Chain",
        cell: (row) => {
          const chainId = row.getValue();
          const chain = getChain(chainId);
          return <Image src={chain?.icon} boxSize={4} />;
        },
      }),
      columnHelper.accessor((r) => [r.transaction_hash, r.error] as const, {
        header: "Hash",
        cell: (row) => {
          const [hash, error] = row.getValue();
          return (
            <Stack spacing={0} w="fit-content">
              <Badge colorScheme={error ? "red" : "green"}>
                {error || "Success"}
              </Badge>
              <HexHighlightBadge>{hash}</HexHighlightBadge>
            </Stack>
          );
        },
      }),
      columnHelper.accessor((r) => [r.from_address, r.to_address] as const, {
        header: "From / To",
        cell: (row) => {
          const [from, to] = row.getValue();
          return (
            <Stack align="end" spacing={0} w="fit-content">
              <HStack>
                <Badge colorScheme="yellow" variant="outline">
                  From
                </Badge>
                <HexHighlightBadge>{from}</HexHighlightBadge>
              </HStack>
              <HStack>
                <Badge colorScheme="blue" variant="outline">
                  To
                </Badge>
                <HexHighlightBadge>{to}</HexHighlightBadge>
              </HStack>
            </Stack>
          );
        },
      }),
      columnHelper.accessor(
        (r) => [r.ec_pairing_count, r.ec_recover_addresses] as const,
        {
          header: "Type",
          cell: (row) => {
            const [pairingCount, addresses] = row.getValue();
            return (
              <Stack spacing={1}>
                <HStack>
                  {pairingCount > 0 && <Badge colorScheme="orange">ZK</Badge>}
                  {addresses.length > 0 && <Badge colorScheme="cyan">AA</Badge>}
                </HStack>
                {addresses.length > 0 && (
                  <HStack>
                    <HexHighlightBadge color="cyan.300">
                      {addresses[0]}
                    </HexHighlightBadge>
                    {addresses.length > 1 && (
                      <Badge colorScheme="cyan">+{addresses.length - 1}</Badge>
                    )}
                  </HStack>
                )}
              </Stack>
            );
          },
        }
      ),
      columnHelper.accessor((r) => [r.chain_id, r.value] as const, {
        header: "Value",
        cell: (row) => {
          const [chainId, value] = row.getValue();
          const chain = getChain(chainId);
          return (
            <Text>
              {numbro(formatEther(value)).format({
                thousandSeparated: true,
                mantissa: 4,
                optionalMantissa: true,
              })}{" "}
              {chain?.nativeCurrency.symbol}
            </Text>
          );
        },
      }),
      columnHelper.accessor("block_timestamp", {
        header: "Timestamp",
        cell: (row) => {
          const since = useSince(row.getValue() * 1000);
          return since;
        },
      }),
    ];
  }, []);

  const table = useReactTable({
    data: txs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.transaction_hash,
  });

  return (
    <>
      <AppHeader title="Latest Tranactions" />
      <Section>
        <Heading>Latest Tranactions</Heading>
        <AnimatedTable table={table} />
      </Section>
    </>
  );
};
