import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { IBlock } from "@/interfaces/block";
import { IBlockTransaction } from "@/interfaces/transaction";
import { getBlock, getBlockTxs } from "@/services/block";
import { Heading, Stack } from "@chakra-ui/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { GetServerSidePropsContext, GetServerSideProps } from "next";
import { AnimatedTable } from "../layouts/AnimatedTable";
import _ from "lodash";
import { useTransactionColumn } from "@/hooks/columns/useTransactionColumn";

interface IBlockPageProps {
  block: IBlock | null;
  txs: IBlockTransaction[] | null;
  totalTxsGas: number;
  totalTxsGasFirstDegree: number;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  const { chainId: cid, number } = context.query;
  const chainId = Number(cid);
  const blockNumber = Number(number);

  if (isNaN(chainId) || isNaN(blockNumber)) {
    return {
      props: {
        block: null,
        txs: null,
        totalTxsGas: 0,
        totalTxsGasFirstDegree: 0,
      },
    };
  }

  const [block, txs] = await Promise.all([
    getBlock(chainId, blockNumber),
    getBlockTxs(chainId, blockNumber),
  ]);

  return {
    props: {
      block,
      txs,
      totalTxsGas: txs ? _.reduce(txs, (s, tx) => s + tx.gas_used_total, 0) : 0,
      totalTxsGasFirstDegree: txs
        ? _.reduce(txs, (s, tx) => s + tx.gas_used_first_degree, 0)
        : 0,
    },
  };
}) satisfies GetServerSideProps<IBlockPageProps>;

export const BlockPage = ({
  block,
  txs,
  totalTxsGas,
  totalTxsGasFirstDegree,
}: IBlockPageProps) => {
  const chain = getChain(block?.chain_id);
  const columns = useTransactionColumn();

  const table = useReactTable({
    data: txs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.transaction_hash,
  });

  return (
    <>
      <AppHeader title={`${chain?.name} Block ${block?.number}`} />
      <Section>
        <Heading>Block {block?.number}</Heading>
        <Stack></Stack>
        <Heading size="lg">Transactions</Heading>
        <AnimatedTable table={table} />
      </Section>
    </>
  );
};
