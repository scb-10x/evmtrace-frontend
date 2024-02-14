import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import { ILatestTransaction } from "@/interfaces/transaction";
import {
  Badge,
  HStack,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { AnimatedTable } from "../layouts/AnimatedTable";
import { formatHex } from "@/utils/string";
import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { LuMoveRight } from "react-icons/lu";
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
          return (
            <HStack>
              <Image src={chain?.icon} boxSize={4} />
              <Text>{chain?.name}</Text>
            </HStack>
          );
        },
      }),
      columnHelper.accessor("transaction_hash", {
        header: "Hash",
        cell: (row) => <HexHighlightBadge>{row.getValue()}</HexHighlightBadge>,
      }),
      columnHelper.accessor((r) => [r.from_address, r.to_address] as const, {
        header: "From / To",
        cell: (row) => {
          const [from, to] = row.getValue();
          return (
            <HStack>
              <HexHighlightBadge>{formatHex(from)}</HexHighlightBadge>
              <Icon as={LuMoveRight} />
              <HexHighlightBadge>{formatHex(to)}</HexHighlightBadge>
            </HStack>
          );
        },
      }),
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
      columnHelper.accessor(
        (r) => [r.ec_pairing_count, r.ec_recover_addresses] as const,
        {
          header: "Type",
          cell: (row) => {
            const [pairingCount, recoverAddresses] = row.getValue();
            return (
              <HStack
                fontSize="sm"
                sx={{
                  "& > *": {
                    fontSize: "inherit",
                  },
                }}
              >
                {pairingCount > 0 && <Badge colorScheme="orange">ZK</Badge>}
                {recoverAddresses.length > 0 && (
                  <Badge colorScheme="cyan">AA</Badge>
                )}
              </HStack>
            );
          },
        }
      ),
      columnHelper.accessor("ec_recover_addresses", {
        header: "Related",
        cell: (row) => {
          const addresses = row.getValue();
          return (
            <HStack>
              {addresses.length > 0 ? (
                <>
                  <HexHighlightBadge color="cyan.300">
                    {addresses[0]}
                  </HexHighlightBadge>
                  {addresses.length > 1 && (
                    <Badge fontSize="sm" colorScheme="cyan">
                      +{addresses.length - 1}
                    </Badge>
                  )}
                </>
              ) : (
                <Badge fontSize="sm">None</Badge>
              )}
            </HStack>
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
